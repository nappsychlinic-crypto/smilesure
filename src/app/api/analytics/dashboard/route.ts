import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Appointment, { AppointmentStatus } from '@/models/Appointment';
import Payment from '@/models/Payment';
import User, { UserRole } from '@/models/User';
import { withAuth, AuthenticatedRequest } from '@/lib/api-middleware';
import logger from '@/lib/logger';

async function handleGet(
    request: NextRequest,
    _context: { params: Promise<Record<string, string>> },
    { user }: AuthenticatedRequest
) {
    const startTime = Date.now();
    const path = '/api/analytics/dashboard';

    try {
        logger.api.request('GET', path, { userId: user.userId, role: user.role });

        await connectDB();

        const todayStart = new Date();
        todayStart.setHours(0, 0, 0, 0);

        const todayEnd = new Date();
        todayEnd.setHours(23, 59, 59, 999);

        let data = {};

        if (user.role === UserRole.ADMIN || user.role === UserRole.FRONT_DESK) {
            // Staff Dashboard Data
            const monthStart = new Date();
            monthStart.setDate(1);
            monthStart.setHours(0, 0, 0, 0);

            const [
                todayAppointments,
                completedToday,
                totalPatients,
                monthlyRevenueResult,
                todaySchedule,
                monthlyNewPatients
            ] = await Promise.all([
                // Today's Appointments
                Appointment.countDocuments({
                    appointmentDateTime: { $gte: todayStart, $lte: todayEnd }
                }),
                // Completed Today
                Appointment.countDocuments({
                    appointmentDateTime: { $gte: todayStart, $lte: todayEnd },
                    status: AppointmentStatus.COMPLETED
                }),
                // Total Patients
                User.countDocuments({ role: UserRole.USER }),
                // Monthly Revenue (Admin only)
                user.role === UserRole.ADMIN ? Payment.aggregate([
                    {
                        $match: {
                            paymentDate: { $gte: monthStart }
                        }
                    },
                    {
                        $group: {
                            _id: null,
                            total: { $sum: '$amount' }
                        }
                    }
                ]) : Promise.resolve([]),
                // Today's Schedule (Recent 5)
                Appointment.find({
                    appointmentDateTime: { $gte: todayStart, $lte: todayEnd }
                })
                    .populate('patientId', 'name')
                    .sort({ appointmentDateTime: 1 })
                    .limit(5)
                    .lean(),
                // Insights: New Patients this month
                User.countDocuments({
                    role: UserRole.USER,
                    createdAt: { $gte: monthStart }
                })
            ]);

            data = {
                todayAppointments,
                completedToday,
                totalPatients,
                monthlyRevenue: monthlyRevenueResult[0]?.total || 0,
                todaySchedule,
                insights: [
                    { label: 'New Patients (This Month)', value: monthlyNewPatients },
                    { label: 'Appointments Today', value: todayAppointments }
                ]
            };
        } else if (user.role === UserRole.USER) {
            // Patient Dashboard Data
            const now = new Date();

            const [
                upcomingAppointments,
                pastVisits,
                nextAppointment
            ] = await Promise.all([
                // Upcoming count
                Appointment.countDocuments({
                    patientId: user.userId,
                    appointmentDateTime: { $gte: now },
                    status: { $nin: [AppointmentStatus.CANCELLED, AppointmentStatus.NO_SHOW] }
                }),
                // Past visits count
                Appointment.countDocuments({
                    patientId: user.userId,
                    appointmentDateTime: { $lt: now },
                    status: AppointmentStatus.COMPLETED
                }),
                // Next specific appointment
                Appointment.findOne({
                    patientId: user.userId,
                    appointmentDateTime: { $gte: now },
                    status: { $nin: [AppointmentStatus.CANCELLED, AppointmentStatus.NO_SHOW] }
                }).sort({ appointmentDateTime: 1 }).select('appointmentDateTime treatmentType status')
            ]);

            data = {
                upcomingAppointments,
                pastVisits,
                nextAppointment,
            };
        }

        logger.info('Dashboard stats fetched', { role: user.role });
        logger.api.response('GET', path, 200, Date.now() - startTime);

        return NextResponse.json({
            success: true,
            data,
        });
    } catch (error) {
        logger.api.error('GET', path, error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

export const GET = withAuth(handleGet);
