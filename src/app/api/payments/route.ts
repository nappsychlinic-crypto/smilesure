import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Payment, { PaymentMode } from '@/models/Payment';
import Appointment, { AppointmentStatus } from '@/models/Appointment';
import { withStaffAuth, AuthenticatedRequest } from '@/lib/api-middleware';
import logger from '@/lib/logger';

async function handlePost(
    request: NextRequest,
    _context: { params: Promise<Record<string, string>> },
    { user }: AuthenticatedRequest
) {
    const startTime = Date.now();
    const path = '/api/payments';

    try {
        logger.api.request('POST', path, { userId: user.userId });

        const body = await request.json();
        const { appointmentId, amount, paymentMode, transactionNumber } = body;

        if (!appointmentId) {
            return NextResponse.json(
                { error: 'Appointment ID is required' },
                { status: 400 }
            );
        }

        if (!amount || amount <= 0) {
            return NextResponse.json(
                { error: 'Valid amount is required' },
                { status: 400 }
            );
        }

        if (!paymentMode || !Object.values(PaymentMode).includes(paymentMode)) {
            return NextResponse.json(
                { error: 'Valid payment mode is required (CASH or ONLINE)' },
                { status: 400 }
            );
        }

        // Require transaction number for online payments
        if (paymentMode === PaymentMode.ONLINE && !transactionNumber) {
            return NextResponse.json(
                { error: 'Transaction number is required for online payments' },
                { status: 400 }
            );
        }

        await connectDB();

        // Check if appointment exists
        const appointment = await Appointment.findById(appointmentId);
        if (!appointment) {
            return NextResponse.json(
                { error: 'Appointment not found' },
                { status: 404 }
            );
        }

        // Check if payment already exists
        const existingPayment = await Payment.findOne({ appointmentId });
        if (existingPayment) {
            return NextResponse.json(
                { error: 'Payment already exists for this appointment' },
                { status: 409 }
            );
        }

        // Create payment
        const paymentData = {
            appointmentId,
            patientId: appointment.patientId,
            amount,
            paymentMode,
            transactionNumber: paymentMode === PaymentMode.ONLINE ? transactionNumber : undefined,
            paymentDate: new Date(),
            createdBy: user.userId,
        };

        logger.info('Creating payment with data', { paymentData });

        const payment = await Payment.create(paymentData);

        // Update appointment status to Completed
        await Appointment.findByIdAndUpdate(appointmentId, {
            status: AppointmentStatus.COMPLETED,
            lastModifiedBy: user.userId,
        });

        logger.info('Payment created successfully', {
            paymentId: payment._id.toString(),
            appointmentId,
            amount,
            paymentMode,
            transactionNumber: payment.transactionNumber,
        });
        logger.api.response('POST', path, 201, Date.now() - startTime);

        return NextResponse.json({
            success: true,
            data: payment,
        }, { status: 201 });
    } catch (error) {
        logger.api.error('POST', path, error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

async function handleGet(
    request: NextRequest,
    _context: { params: Promise<Record<string, string>> },
    { user }: AuthenticatedRequest
) {
    const startTime = Date.now();
    const path = '/api/payments';

    try {
        logger.api.request('GET', path, { userId: user.userId });

        await connectDB();

        const searchParams = request.nextUrl.searchParams;
        const appointmentId = searchParams.get('appointmentId');

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const query: Record<string, any> = {};

        if (appointmentId) {
            query.appointmentId = appointmentId;
        }

        const payments = await Payment.find(query)
            .populate('appointmentId')
            .populate('patientId', 'name mobileNumber')
            .populate('createdBy', 'name')
            .sort({ paymentDate: -1 })
            .lean();

        logger.api.response('GET', path, 200, Date.now() - startTime);

        return NextResponse.json({
            success: true,
            data: payments,
        });
    } catch (error) {
        logger.api.error('GET', path, error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

export const POST = withStaffAuth(handlePost);
export const GET = withStaffAuth(handleGet);
