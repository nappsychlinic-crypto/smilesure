import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import logger from '@/lib/logger';

export async function POST() {
    const startTime = Date.now();
    const path = '/api/auth/logout';

    try {
        logger.api.request('POST', path);

        const cookieStore = await cookies();
        cookieStore.delete('auth_token');

        logger.info('User logged out successfully');
        logger.api.response('POST', path, 200, Date.now() - startTime);

        return NextResponse.json({
            success: true,
            message: 'Logged out successfully',
        });
    } catch (error) {
        logger.api.error('POST', path, error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
