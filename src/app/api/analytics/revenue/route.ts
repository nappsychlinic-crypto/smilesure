import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Payment from '@/models/Payment';
import Appointment from '@/models/Appointment';
import { withAdminAuth, AuthenticatedRequest } from '@/lib/api-middleware';
import logger from '@/lib/logger';

async function handleGet(
    request: NextRequest,
    _context: { params: Promise<Record<string, string>> },
    { user }: AuthenticatedRequest
) {
    const startTime = Date.now();
    const path = '/api/analytics/revenue';

    try {
        logger.api.request('GET', path, { userId: user.userId });

        await connectDB();

        const searchParams = request.nextUrl.searchParams;
        const period = searchParams.get('period') || 'monthly'; // daily, weekly, monthly
        const startDate = searchParams.get('startDate');
        const endDate = searchParams.get('endDate');

        // Default date range: last 30 days
        const end = endDate ? new Date(endDate) : new Date();
        const start = startDate
            ? new Date(startDate)
            : new Date(end.getTime() - 30 * 24 * 60 * 60 * 1000);

        // Total revenue
        const totalRevenueResult = await Payment.aggregate([
            {
                $match: {
                    paymentDate: { $gte: start, $lte: end },
                },
            },
            {
                $group: {
                    _id: null,
                    total: { $sum: '$amount' },
                    count: { $sum: 1 },
                },
            },
        ]);

        const totalRevenue = totalRevenueResult[0]?.total || 0;
        const totalPayments = totalRevenueResult[0]?.count || 0;

        // Revenue by period
        let dateFormat: string;
        switch (period) {
            case 'daily':
                dateFormat = '%Y-%m-%d';
                break;
            case 'weekly':
                dateFormat = '%Y-W%V';
                break;
            default:
                dateFormat = '%Y-%m';
        }

        const revenueByPeriod = await Payment.aggregate([
            {
                $match: {
                    paymentDate: { $gte: start, $lte: end },
                },
            },
            {
                $group: {
                    _id: { $dateToString: { format: dateFormat, date: '$paymentDate' } },
                    total: { $sum: '$amount' },
                    count: { $sum: 1 },
                },
            },
            { $sort: { _id: 1 } },
        ]);

        // Revenue by treatment type (from appointments with payments)
        const revenueByTreatment = await Payment.aggregate([
            {
                $match: {
                    paymentDate: { $gte: start, $lte: end },
                },
            },
            {
                $lookup: {
                    from: 'appointments',
                    localField: 'appointmentId',
                    foreignField: '_id',
                    as: 'appointment',
                },
            },
            { $unwind: '$appointment' },
            {
                $group: {
                    _id: '$appointment.treatmentType',
                    total: { $sum: '$amount' },
                    count: { $sum: 1 },
                },
            },
            { $sort: { total: -1 } },
        ]);

        // Revenue by payment mode
        const revenueByPaymentMode = await Payment.aggregate([
            {
                $match: {
                    paymentDate: { $gte: start, $lte: end },
                },
            },
            {
                $group: {
                    _id: '$paymentMode',
                    total: { $sum: '$amount' },
                    count: { $sum: 1 },
                },
            },
        ]);

        // Average revenue per appointment
        const avgRevenuePerAppointment = totalPayments > 0
            ? (totalRevenue / totalPayments).toFixed(2)
            : 0;

        // Top paying patients
        const topPatients = await Payment.aggregate([
            {
                $match: {
                    paymentDate: { $gte: start, $lte: end },
                },
            },
            {
                $group: {
                    _id: '$patientId',
                    total: { $sum: '$amount' },
                    count: { $sum: 1 },
                },
            },
            { $sort: { total: -1 } },
            { $limit: 10 },
            {
                $lookup: {
                    from: 'users',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'patient',
                },
            },
            { $unwind: '$patient' },
            {
                $project: {
                    patientId: '$_id',
                    name: '$patient.name',
                    email: '$patient.email',
                    total: 1,
                    count: 1,
                },
            },
        ]);

        logger.info('Revenue analytics fetched', { period, startDate: start, endDate: end });
        logger.api.response('GET', path, 200, Date.now() - startTime);

        return NextResponse.json({
            success: true,
            data: {
                summary: {
                    totalRevenue,
                    totalPayments,
                    avgRevenuePerAppointment: parseFloat(avgRevenuePerAppointment as string),
                    period: { start, end },
                },
                revenueByPeriod,
                revenueByTreatment,
                revenueByPaymentMode,
                topPatients,
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

export const GET = withAdminAuth(handleGet);
