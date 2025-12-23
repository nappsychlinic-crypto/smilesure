import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import User from '@/models/User';
import { hashPassword, comparePassword, getCurrentUser } from '@/lib/auth';
import logger from '@/lib/logger';

export async function POST(request: Request) {
    const startTime = Date.now();
    const path = '/api/auth/change-password';

    try {
        logger.api.request('POST', path);

        const currentUser = await getCurrentUser();
        if (!currentUser) {
            return NextResponse.json(
                { error: 'Authentication required' },
                { status: 401 }
            );
        }

        const body = await request.json();
        const { currentPassword, newPassword } = body;

        if (!currentPassword || !newPassword) {
            return NextResponse.json(
                { error: 'Current password and new password are required' },
                { status: 400 }
            );
        }

        if (newPassword.length < 8) {
            return NextResponse.json(
                { error: 'New password must be at least 8 characters' },
                { status: 400 }
            );
        }

        await connectDB();

        const user = await User.findById(currentUser.userId);
        if (!user) {
            return NextResponse.json(
                { error: 'User not found' },
                { status: 404 }
            );
        }

        // Verify current password
        const isValidPassword = await comparePassword(currentPassword, user.passwordHash);
        if (!isValidPassword) {
            logger.warn('Change password with invalid current password', { userId: currentUser.userId });
            return NextResponse.json(
                { error: 'Current password is incorrect' },
                { status: 400 }
            );
        }

        // Hash and update new password
        const newPasswordHash = await hashPassword(newPassword);
        await User.findByIdAndUpdate(user._id, {
            passwordHash: newPasswordHash,
            mustResetPassword: false,
        });

        logger.info('Password changed successfully', { userId: currentUser.userId });
        logger.api.response('POST', path, 200, Date.now() - startTime);

        return NextResponse.json({
            success: true,
            message: 'Password changed successfully',
        });
    } catch (error) {
        logger.api.error('POST', path, error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
