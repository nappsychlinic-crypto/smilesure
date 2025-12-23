import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { ensureSeeded } from '@/lib/seed';
import logger from '@/lib/logger';

export async function GET() {
    const path = '/api/seed';

    try {
        logger.api.request('GET', path);

        await connectDB();
        await ensureSeeded();

        logger.info('Seed check completed');

        return NextResponse.json({
            success: true,
            message: 'Database seed check completed',
        });
    } catch (error) {
        logger.api.error('GET', path, error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
