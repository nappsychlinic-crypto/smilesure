import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import User from '@/models/User';
import { hashPassword, getCurrentUser } from '@/lib/auth';
import logger from '@/lib/logger';

export async function POST(request: Request) {
    const startTime = Date.now();
    const path = '/api/auth/reset-password';

    try {
        logger.api.request('POST', path);

        const body = await request.json();
        const { token, newPassword } = body;

        if (!newPassword) {
            logger.warn('Reset password with missing password');
            return NextResponse.json(
                { error: 'New password is required' },
                { status: 400 }
            );
        }

        if (newPassword.length < 8) {
            logger.warn('Reset password with weak password');
            return NextResponse.json(
                { error: 'Password must be at least 8 characters' },
                { status: 400 }
            );
        }

        await connectDB();
        logger.debug('Database connected for reset password');

        let user;

        if (token) {
            // Token-based reset (from email link)
            user = await User.findOne({
                resetPasswordToken: token,
                resetPasswordExpires: { $gt: new Date() },
            });

            if (!user) {
                logger.warn('Reset password with invalid or expired token', { token: token.substring(0, 10) + '...' });
                return NextResponse.json(
                    { error: 'Invalid or expired reset token' },
                    { status: 400 }
                );
            }
        } else {
            // Session-based reset (for logged-in users with mustResetPassword)
            const currentUser = await getCurrentUser();

            if (!currentUser) {
                logger.warn('Reset password without token or session');
                return NextResponse.json(
                    { error: 'Token is required for password reset' },
                    { status: 400 }
                );
            }

            user = await User.findById(currentUser.userId);

            if (!user) {
                logger.warn('Reset password for non-existent user', { userId: currentUser.userId });
                return NextResponse.json(
                    { error: 'User not found' },
                    { status: 404 }
                );
            }

            if (!user.mustResetPassword) {
                logger.warn('User does not need to reset password', { userId: currentUser.userId });
                return NextResponse.json(
                    { error: 'Password reset not required' },
                    { status: 400 }
                );
            }
        }

        // Hash new password and update user
        const passwordHash = await hashPassword(newPassword);

        await User.findByIdAndUpdate(user._id, {
            passwordHash,
            resetPasswordToken: undefined,
            resetPasswordExpires: undefined,
            mustResetPassword: false,
        });

        logger.info('Password reset successfully', { userId: user._id.toString(), mobileNumber: user.mobileNumber });
        logger.api.response('POST', path, 200, Date.now() - startTime);

        return NextResponse.json({
            success: true,
            message: 'Password has been reset successfully.',
        });
    } catch (error) {
        logger.api.error('POST', path, error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
