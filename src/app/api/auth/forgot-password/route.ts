import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import User from '@/models/User';
import { generateResetToken, getResetTokenExpiry } from '@/lib/auth';
import logger from '@/lib/logger';

export async function POST(request: Request) {
    const startTime = Date.now();
    const path = '/api/auth/forgot-password';

    try {
        logger.api.request('POST', path);

        const body = await request.json();
        const { email } = body;

        if (!email) {
            logger.warn('Forgot password request with missing email');
            return NextResponse.json(
                { error: 'Email is required' },
                { status: 400 }
            );
        }

        await connectDB();
        logger.debug('Database connected for forgot password');

        const user = await User.findOne({ email: email.toLowerCase() });

        // Always return success to prevent email enumeration
        if (!user) {
            logger.info('Forgot password request for non-existent email', { email });
            return NextResponse.json({
                success: true,
                message: 'If an account exists with this email, you will receive a password reset link.',
            });
        }

        // Generate reset token
        const resetToken = generateResetToken();
        const resetExpires = getResetTokenExpiry();

        await User.findByIdAndUpdate(user._id, {
            resetPasswordToken: resetToken,
            resetPasswordExpires: resetExpires,
        });

        // TODO: Send email with reset link
        // For now, log the token (development only)
        logger.info('Password reset token generated', {
            email,
            userId: user._id.toString(),
            token: resetToken, // Remove in production
            expiresAt: resetExpires.toISOString(),
        });

        logger.api.response('POST', path, 200, Date.now() - startTime);

        return NextResponse.json({
            success: true,
            message: 'If an account exists with this email, you will receive a password reset link.',
            // Development only - remove in production
            ...(process.env.NODE_ENV !== 'production' && { resetToken }),
        });
    } catch (error) {
        logger.api.error('POST', path, error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
