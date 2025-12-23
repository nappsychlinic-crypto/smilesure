import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Appointment, { AppointmentStatus } from '@/models/Appointment';
import TreatmentType from '@/models/TreatmentType';
import { UserRole } from '@/models/User';
import { withAuth, withStaffAuth, AuthenticatedRequest } from '@/lib/api-middleware';
import logger from '@/lib/logger';

async function handleGet(
    request: NextRequest,
    _context: { params: Promise<Record<string, string>> },
    { user }: AuthenticatedRequest
) {
    const startTime = Date.now();
    const path = '/api/appointments';

    try {
        logger.api.request('GET', path, { userId: user.userId, role: user.role });

        await connectDB();

        const searchParams = request.nextUrl.searchParams;
        const status = searchParams.get('status');
        const patientId = searchParams.get('patientId');
        const createdBy = searchParams.get('createdBy');
        const startDate = searchParams.get('startDate');
        const endDate = searchParams.get('endDate');
        const upcoming = searchParams.get('upcoming');
        const reminderSent = searchParams.get('reminderSent');
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '20');

        // Build query
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const query: Record<string, any> = {};

        // Role-based filtering
        if (user.role === UserRole.USER) {
            // Users can only see their own appointments
            query.patientId = user.userId;
        } else {
            // Admin and Front Desk can see all, optionally filter by patient
            if (patientId) query.patientId = patientId;
        }

        // Status filter
        if (status) {
            query.status = status;
        }

        // Created by filter (Admin only)
        if (createdBy && user.role === UserRole.ADMIN) {
            query.createdBy = createdBy;
        }

        // Date range filter
        if (startDate || endDate) {
            query.appointmentDateTime = {};
            if (startDate) query.appointmentDateTime.$gte = new Date(startDate);
            if (endDate) query.appointmentDateTime.$lte = new Date(endDate);
        }

        // Upcoming/past filter
        if (upcoming === 'true') {
            query.appointmentDateTime = { ...query.appointmentDateTime, $gte: new Date() };
        } else if (upcoming === 'false') {
            query.appointmentDateTime = { ...query.appointmentDateTime, $lt: new Date() };
        }

        // Reminder sent filter
        if (reminderSent !== null && reminderSent !== undefined) {
            query.reminderSent = reminderSent === 'true';
        }

        const skip = (page - 1) * limit;

        const [appointments, total] = await Promise.all([
            Appointment.find(query)
                .populate('patientId', 'name email phone mobileNumber countryCode')
                .populate('createdBy', 'name email')
                .populate('lastModifiedBy', 'name email')
                .sort({ appointmentDateTime: -1 })
                .skip(skip)
                .limit(limit)
                .lean(),
            Appointment.countDocuments(query),
        ]);

        logger.info('Appointments fetched', { count: appointments.length, total, page, limit });
        logger.api.response('GET', path, 200, Date.now() - startTime);

        return NextResponse.json({
            success: true,
            data: appointments,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        });
    } catch (error) {
        logger.api.error('GET', path, error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

async function handlePost(
    request: NextRequest,
    _context: { params: Promise<Record<string, string>> },
    { user }: AuthenticatedRequest
) {
    const startTime = Date.now();
    const path = '/api/appointments';

    try {
        logger.api.request('POST', path, { userId: user.userId, role: user.role });

        const body = await request.json();
        const { patientId, appointmentDateTime, treatmentType, feeAmount, notes } = body;

        // Validate required fields
        if (!appointmentDateTime || !treatmentType) {
            logger.warn('Create appointment with missing fields');
            return NextResponse.json(
                { error: 'Appointment date/time and treatment type are required' },
                { status: 400 }
            );
        }

        // For staff: patientId is required
        // For users: they book for themselves
        const effectivePatientId = user.role === UserRole.USER ? user.userId : patientId;

        if (!effectivePatientId) {
            logger.warn('Create appointment without patient ID');
            return NextResponse.json(
                { error: 'Patient ID is required' },
                { status: 400 }
            );
        }

        await connectDB();

        const appointmentDate = new Date(appointmentDateTime);

        // Check for conflicting appointments (same patient, same time slot within 30 mins)
        const conflictCheck = await Appointment.findOne({
            patientId: effectivePatientId,
            appointmentDateTime: {
                $gte: new Date(appointmentDate.getTime() - 30 * 60 * 1000),
                $lte: new Date(appointmentDate.getTime() + 30 * 60 * 1000),
            },
            status: { $nin: [AppointmentStatus.CANCELLED, AppointmentStatus.NO_SHOW] },
        });

        if (conflictCheck) {
            logger.warn('Appointment conflict detected', {
                patientId: effectivePatientId,
                requestedTime: appointmentDateTime
            });
            return NextResponse.json(
                { error: 'An appointment already exists around this time' },
                { status: 409 }
            );
        }


        let finalFeeAmount = feeAmount;

        // If user is a patient or fee not provided, lookup from TreatmentType
        if (user.role === UserRole.USER || finalFeeAmount === undefined) {
            const typeDoc = await TreatmentType.findOne({ name: treatmentType });
            if (typeDoc) {
                finalFeeAmount = typeDoc.price;
            }
        }

        const appointment = await Appointment.create({
            patientId: effectivePatientId,
            appointmentDateTime: appointmentDate,
            treatmentType,
            feeAmount: finalFeeAmount || 0,
            notes: notes || '',
            status: user.role === UserRole.USER ? AppointmentStatus.SCHEDULED : AppointmentStatus.CONFIRMED,
            createdBy: user.userId,
            lastModifiedBy: user.userId,
            reminderSent: false,
        });

        const populatedAppointment = await Appointment.findById(appointment._id)
            .populate('patientId', 'name email phone mobileNumber countryCode')
            .lean();

        logger.info('Appointment created', {
            appointmentId: appointment._id.toString(),
            patientId: effectivePatientId,
            dateTime: appointmentDateTime,
            createdBy: user.userId,
        });
        logger.api.response('POST', path, 201, Date.now() - startTime);

        return NextResponse.json({
            success: true,
            data: populatedAppointment,
        }, { status: 201 });
    } catch (error) {
        logger.api.error('POST', path, error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

export const GET = withAuth(handleGet);
export const POST = withAuth(handlePost);
