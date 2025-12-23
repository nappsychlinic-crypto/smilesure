import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import TreatmentType from '@/models/TreatmentType';
import { withAuth, AuthenticatedRequest } from '@/lib/api-middleware';
import { UserRole } from '@/models/User';
import logger from '@/lib/logger';

async function handleGet(request: NextRequest) {
    try {
        await connectDB();
        const { searchParams } = new URL(request.url);
        const isActive = searchParams.get('isActive');

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const query: any = {};
        if (isActive !== null) {
            query.isActive = isActive === 'true';
        }

        const treatmentTypes = await TreatmentType.find(query).sort({ name: 1 });

        return NextResponse.json({
            success: true,
            data: treatmentTypes,
        });
    } catch (error) {
        logger.error('Error fetching treatment types:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

async function handlePost(
    request: NextRequest,
    context: { params: Promise<Record<string, string>> },
    { user }: AuthenticatedRequest
) {
    try {
        if (user.role !== UserRole.ADMIN) {
            return NextResponse.json(
                { error: 'Forbidden' },
                { status: 403 }
            );
        }

        const body = await request.json();
        const { name, price, description, isActive } = body;

        if (!name || price === undefined) {
            return NextResponse.json(
                { error: 'Name and price are required' },
                { status: 400 }
            );
        }

        await connectDB();

        const treatmentType = await TreatmentType.create({
            name,
            price,
            description,
            isActive: isActive !== undefined ? isActive : true,
        });

        logger.info(`Treatment type created: ${name} by ${user.mobileNumber}`);

        return NextResponse.json({
            success: true,
            data: treatmentType,
        }, { status: 201 });
    } catch (error) {
        logger.error('Error creating treatment type:', error);
        // Check for duplicate key error
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        if ((error as any).code === 11000) {
            return NextResponse.json(
                { error: 'Treatment type with this name already exists' },
                { status: 400 }
            );
        }
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

// GET is public (authenticated users)
export const GET = withAuth(handleGet);
export const POST = withAuth(handlePost);
