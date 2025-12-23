import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/jwt';
import logger from '@/lib/logger';

export async function GET() {
    const path = '/api/auth/me';

    try {
        logger.api.request('GET', path);

        const cookieStore = await cookies();
        const token = cookieStore.get('auth_token')?.value;

        if (!token) {
            logger.debug('No auth token found');
            return NextResponse.json(
                { authenticated: false, user: null },
                { status: 200 }
            );
        }

        const payload = verifyToken(token);

        if (!payload) {
            logger.warn('Invalid auth token');
            return NextResponse.json(
                { authenticated: false, user: null },
                { status: 200 }
            );
        }

        logger.debug('User session verified', { userId: payload.userId });

        return NextResponse.json({
            authenticated: true,
            user: {
                id: payload.userId,
                name: payload.name,
                mobileNumber: payload.mobileNumber,
                countryCode: '+91', // Default country code
                role: payload.role,
            },
        });
    } catch (error) {
        logger.api.error('GET', path, error);
        return NextResponse.json(
            { authenticated: false, user: null },
            { status: 200 }
        );
    }
}
