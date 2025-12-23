import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Appointment, { AppointmentStatus } from '@/models/Appointment';
import Payment, { PaymentMode } from '@/models/Payment';
import { UserRole } from '@/models/User';
import { withAuth, AuthenticatedRequest } from '@/lib/api-middleware';
import logger from '@/lib/logger';

async function handlePatch(
    request: NextRequest,
    context: { params: Promise<Record<string, string>> },
    { user }: AuthenticatedRequest
) {
    const startTime = Date.now();
    const { id } = await context.params;
    const path = `/api/appointments/${id}`;

    try {
        logger.api.request('PATCH', path, { userId: user.userId, role: user.role });

        const body = await request.json();
        const { status, appointmentDateTime, treatmentType, feeAmount, notes, paymentMode } = body;

        await connectDB();

        const appointment = await Appointment.findById(id);

        if (!appointment) {
            logger.warn('Update attempt for non-existent appointment', { id });
            return NextResponse.json(
                { error: 'Appointment not found' },
                { status: 404 }
            );
        }

        // Authorization checks
        const isStaff = user.role === UserRole.ADMIN || user.role === UserRole.FRONT_DESK;
        const isOwnAppointment = appointment.patientId.toString() === user.userId;

        if (!isStaff && !isOwnAppointment) {
            logger.warn('Unauthorized appointment update attempt', {
                userId: user.userId,
                appointmentId: id
            });
            return NextResponse.json(
                { error: 'Forbidden' },
                { status: 403 }
            );
        }

        // Users can only cancel their own appointments
        if (user.role === UserRole.USER) {
            if (status && status !== AppointmentStatus.CANCELLED) {
                logger.warn('User attempted to change appointment status', {
                    userId: user.userId,
                    attemptedStatus: status
                });
                return NextResponse.json(
                    { error: 'Patients can only cancel their appointments' },
                    { status: 403 }
                );
            }
        }

        // Build update object
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const updates: Record<string, any> = {
            lastModifiedBy: user.userId,
        };

        if (status) {
            if (!Object.values(AppointmentStatus).includes(status)) {
                return NextResponse.json(
                    { error: 'Invalid status' },
                    { status: 400 }
                );
            }
            updates.status = status;
        }

        // Staff can update more fields
        if (isStaff) {
            if (appointmentDateTime) updates.appointmentDateTime = new Date(appointmentDateTime);
            if (treatmentType) updates.treatmentType = treatmentType;
            if (feeAmount !== undefined) updates.feeAmount = feeAmount;
            if (notes !== undefined) updates.notes = notes;
        }

        const updatedAppointment = await Appointment.findByIdAndUpdate(
            id,
            updates,
            { new: true }
        )
            .populate('patientId', 'name email phone')
            .populate('createdBy', 'name email')
            .populate('lastModifiedBy', 'name email')
            .lean();

        logger.info('Appointment updated', {
            appointmentId: id,
            updatedBy: user.userId,
            updates: Object.keys(updates).filter(k => k !== 'lastModifiedBy')
        });
        logger.api.response('PATCH', path, 200, Date.now() - startTime);

        return NextResponse.json({
            success: true,
            data: updatedAppointment,
        });
    } catch (error) {
        logger.api.error('PATCH', path, error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

async function handleGet(
    request: NextRequest,
    context: { params: Promise<Record<string, string>> },
    { user }: AuthenticatedRequest
) {
    const { id } = await context.params;
    const path = `/api/appointments/${id}`;

    try {
        logger.api.request('GET', path, { userId: user.userId });

        await connectDB();

        const appointment = await Appointment.findById(id)
            .populate('patientId', 'name email phone')
            .populate('createdBy', 'name email')
            .populate('lastModifiedBy', 'name email')
            .lean();

        if (!appointment) {
            return NextResponse.json(
                { error: 'Appointment not found' },
                { status: 404 }
            );
        }

        // Authorization checks
        const isStaff = user.role === UserRole.ADMIN || user.role === UserRole.FRONT_DESK;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const patientId = (appointment.patientId as any)?._id?.toString() || appointment.patientId?.toString();
        const isOwnAppointment = patientId === user.userId;

        if (!isStaff && !isOwnAppointment) {
            return NextResponse.json(
                { error: 'Forbidden' },
                { status: 403 }
            );
        }

        return NextResponse.json({
            success: true,
            data: appointment,
        });
    } catch (error) {
        logger.api.error('GET', path, error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

export const PATCH = withAuth(handlePatch);
export const GET = withAuth(handleGet);
