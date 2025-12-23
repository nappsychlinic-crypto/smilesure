import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import User, { UserRole } from '@/models/User';
import Appointment from '@/models/Appointment';
import Payment from '@/models/Payment';
import { withAdminAuth, AuthenticatedRequest } from '@/lib/api-middleware';
import logger from '@/lib/logger';

async function handleGet(
    request: NextRequest,
    _context: { params: Promise<Record<string, string>> },
    { user }: AuthenticatedRequest
) {
    const startTime = Date.now();
    const path = '/api/analytics/patients';

    try {
        logger.api.request('GET', path, { userId: user.userId });

        await connectDB();

        // Total registered patients
        const totalPatients = await User.countDocuments({ role: UserRole.USER });

        // Active vs inactive patients
        const activePatients = await User.countDocuments({ role: UserRole.USER, isActive: true });
        const inactivePatients = totalPatients - activePatients;

        // Patients with appointments in last 30 days (considered active visitors)
        const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
        const recentlyVisitedPatients = await Appointment.distinct('patientId', {
            appointmentDateTime: { $gte: thirtyDaysAgo },
        });

        // Repeat visit frequency (average visits per patient)
        const visitFrequency = await Appointment.aggregate([
            {
                $group: {
                    _id: '$patientId',
                    visitCount: { $sum: 1 },
                },
            },
            {
                $group: {
                    _id: null,
                    avgVisits: { $avg: '$visitCount' },
                    maxVisits: { $max: '$visitCount' },
                    minVisits: { $min: '$visitCount' },
                },
            },
        ]);

        // Visit distribution
        const visitDistribution = await Appointment.aggregate([
            {
                $group: {
                    _id: '$patientId',
                    visitCount: { $sum: 1 },
                },
            },
            {
                $bucket: {
                    groupBy: '$visitCount',
                    boundaries: [1, 2, 3, 5, 10, Infinity],
                    default: 'Other',
                    output: {
                        count: { $sum: 1 },
                    },
                },
            },
        ]);

        // Per-patient revenue contribution (top contributors)
        const topContributors = await Payment.aggregate([
            {
                $group: {
                    _id: '$patientId',
                    totalSpent: { $sum: '$amount' },
                    paymentCount: { $sum: 1 },
                },
            },
            { $sort: { totalSpent: -1 } },
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
                    phone: '$patient.phone',
                    totalSpent: 1,
                    paymentCount: 1,
                },
            },
        ]);

        // New patients by month
        const newPatientsByMonth = await User.aggregate([
            {
                $match: { role: UserRole.USER },
            },
            {
                $group: {
                    _id: { $dateToString: { format: '%Y-%m', date: '$createdAt' } },
                    count: { $sum: 1 },
                },
            },
            { $sort: { _id: -1 } },
            { $limit: 12 },
        ]);

        logger.info('Patient analytics fetched');
        logger.api.response('GET', path, 200, Date.now() - startTime);

        return NextResponse.json({
            success: true,
            data: {
                summary: {
                    totalPatients,
                    activePatients,
                    inactivePatients,
                    recentlyVisitedCount: recentlyVisitedPatients.length,
                },
                visitMetrics: {
                    avgVisitsPerPatient: visitFrequency[0]?.avgVisits?.toFixed(2) || 0,
                    maxVisits: visitFrequency[0]?.maxVisits || 0,
                    minVisits: visitFrequency[0]?.minVisits || 0,
                },
                visitDistribution,
                topContributors,
                newPatientsByMonth,
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
