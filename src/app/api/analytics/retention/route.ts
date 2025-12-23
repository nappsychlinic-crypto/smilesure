import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Appointment from '@/models/Appointment';
import { withAdminAuth, AuthenticatedRequest } from '@/lib/api-middleware';
import logger from '@/lib/logger';

async function handleGet(
    request: NextRequest,
    _context: { params: Promise<Record<string, string>> },
    { user }: AuthenticatedRequest
) {
    const startTime = Date.now();
    const path = '/api/analytics/retention';

    try {
        logger.api.request('GET', path, { userId: user.userId });

        await connectDB();

        const searchParams = request.nextUrl.searchParams;
        const dropoffMonths = parseInt(searchParams.get('dropoffMonths') || '3');

        // First-time vs returning patients
        const patientVisitCounts = await Appointment.aggregate([
            {
                $group: {
                    _id: '$patientId',
                    visitCount: { $sum: 1 },
                    firstVisit: { $min: '$appointmentDateTime' },
                    lastVisit: { $max: '$appointmentDateTime' },
                },
            },
        ]);

        const firstTimePatients = patientVisitCounts.filter(p => p.visitCount === 1).length;
        const returningPatients = patientVisitCounts.filter(p => p.visitCount > 1).length;

        // Average time gap between visits
        const visitGaps = await Appointment.aggregate([
            { $sort: { patientId: 1, appointmentDateTime: 1 } },
            {
                $group: {
                    _id: '$patientId',
                    visits: { $push: '$appointmentDateTime' },
                },
            },
            {
                $addFields: {
                    gaps: {
                        $map: {
                            input: { $range: [1, { $size: '$visits' }] },
                            as: 'i',
                            in: {
                                $subtract: [
                                    { $arrayElemAt: ['$visits', '$$i'] },
                                    { $arrayElemAt: ['$visits', { $subtract: ['$$i', 1] }] },
                                ],
                            },
                        },
                    },
                },
            },
            { $unwind: '$gaps' },
            {
                $group: {
                    _id: null,
                    avgGap: { $avg: '$gaps' },
                    minGap: { $min: '$gaps' },
                    maxGap: { $max: '$gaps' },
                },
            },
        ]);

        const avgGapDays = visitGaps[0]
            ? Math.round(visitGaps[0].avgGap / (1000 * 60 * 60 * 24))
            : 0;

        // Drop-off patients (no visit in X months)
        const dropoffDate = new Date();
        dropoffDate.setMonth(dropoffDate.getMonth() - dropoffMonths);

        const dropoffPatients = patientVisitCounts.filter(
            p => new Date(p.lastVisit) < dropoffDate
        );

        // Retention by cohort (patients who returned within 90 days)
        const ninetyDaysMs = 90 * 24 * 60 * 60 * 1000;
        const retainedPatients = patientVisitCounts.filter(p => {
            if (p.visitCount < 2) return false;
            const firstVisit = new Date(p.firstVisit).getTime();
            const lastVisit = new Date(p.lastVisit).getTime();
            return (lastVisit - firstVisit) <= ninetyDaysMs;
        }).length;

        // Monthly retention rate
        const monthlyRetention = await Appointment.aggregate([
            {
                $group: {
                    _id: {
                        patientId: '$patientId',
                        month: { $dateToString: { format: '%Y-%m', date: '$appointmentDateTime' } },
                    },
                },
            },
            {
                $group: {
                    _id: '$_id.patientId',
                    months: { $addToSet: '$_id.month' },
                },
            },
            {
                $addFields: {
                    monthCount: { $size: '$months' },
                },
            },
            {
                $group: {
                    _id: '$monthCount',
                    count: { $sum: 1 },
                },
            },
            { $sort: { _id: 1 } },
        ]);

        logger.info('Retention analytics fetched', { dropoffMonths });
        logger.api.response('GET', path, 200, Date.now() - startTime);

        return NextResponse.json({
            success: true,
            data: {
                summary: {
                    firstTimePatients,
                    returningPatients,
                    returnRate: patientVisitCounts.length > 0
                        ? ((returningPatients / patientVisitCounts.length) * 100).toFixed(1)
                        : 0,
                    avgDaysBetweenVisits: avgGapDays,
                },
                dropoff: {
                    dropoffMonthsThreshold: dropoffMonths,
                    dropoffPatientCount: dropoffPatients.length,
                    dropoffPatients: dropoffPatients.slice(0, 20).map(p => ({
                        patientId: p._id,
                        lastVisit: p.lastVisit,
                        totalVisits: p.visitCount,
                    })),
                },
                retention: {
                    retainedWithin90Days: retainedPatients,
                    monthlyRetention,
                },
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
