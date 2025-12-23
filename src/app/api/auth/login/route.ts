import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import User from '@/models/User';
import { comparePassword } from '@/lib/auth';
import { signToken } from '@/lib/jwt';
import { cookies } from 'next/headers';
import logger from '@/lib/logger';

export async function POST(request: Request) {
    const startTime = Date.now();
    const path = '/api/auth/login';

    try {
        logger.api.request('POST', path);

        const body = await request.json();
        const { mobileNumber, password } = body;

        if (!mobileNumber || !password) {
            logger.warn('Login attempt with missing credentials', { mobileNumber: mobileNumber || 'not provided' });
            return NextResponse.json(
                { error: 'Mobile number and password are required' },
                { status: 400 }
            );
        }

        // Validate mobile number format (10 digits)
        if (!/^\d{10}$/.test(mobileNumber)) {
            return NextResponse.json(
                { error: 'Mobile number must be exactly 10 digits' },
                { status: 400 }
            );
        }

        await connectDB();
        logger.debug('Database connected for login');

        const user = await User.findOne({ mobileNumber });

        if (!user) {
            logger.warn('Login attempt for non-existent user', { mobileNumber });
            return NextResponse.json(
                { error: 'Invalid mobile number or password' },
                { status: 401 }
            );
        }

        if (!user.isActive) {
            logger.warn('Login attempt for inactive user', { mobileNumber, userId: user._id.toString() });
            return NextResponse.json(
                { error: 'Account is deactivated. Please contact support.' },
                { status: 403 }
            );
        }

        const isValidPassword = await comparePassword(password, user.passwordHash);

        if (!isValidPassword) {
            logger.warn('Login attempt with invalid password', { mobileNumber });
            return NextResponse.json(
                { error: 'Invalid mobile number or password' },
                { status: 401 }
            );
        }

        const token = signToken({
            userId: user._id.toString(),
            mobileNumber: user.mobileNumber,
            role: user.role,
            name: user.name,
        });

        // Set the auth cookie
        const cookieStore = await cookies();
        cookieStore.set('auth_token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 60 * 60 * 24 * 7, // 7 days
            path: '/',
        });

        logger.info('User logged in successfully', {
            userId: user._id.toString(),
            mobileNumber: user.mobileNumber,
            role: user.role
        });
        logger.api.response('POST', path, 200, Date.now() - startTime);

        return NextResponse.json({
            success: true,
            user: {
                id: user._id.toString(),
                name: user.name,
                mobileNumber: user.mobileNumber,
                countryCode: user.countryCode,
                role: user.role,
                mustResetPassword: user.mustResetPassword,
            },
        });
    } catch (error) {
        logger.api.error('POST', path, error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
