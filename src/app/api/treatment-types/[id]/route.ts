import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import TreatmentType from '@/models/TreatmentType';
import { withAuth, AuthenticatedRequest } from '@/lib/api-middleware';
import { UserRole } from '@/models/User';
import logger from '@/lib/logger';

async function handlePut(
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

        const { id } = await context.params;
        const body = await request.json();

        await connectDB();

        const treatmentType = await TreatmentType.findByIdAndUpdate(
            id,
            body,
            { new: true, runValidators: true }
        );

        if (!treatmentType) {
            return NextResponse.json(
                { error: 'Treatment type not found' },
                { status: 404 }
            );
        }

        logger.info(`Treatment type updated: ${treatmentType.name} by ${user.mobileNumber}`);

        return NextResponse.json({
            success: true,
            data: treatmentType,
        });
    } catch (error) {
        logger.error('Error updating treatment type:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

async function handleDelete(
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

        const { id } = await context.params;

        await connectDB();

        // Instead of hard delete, we might just want to deactivate? 
        // But the requirement says "delete/deactivate". Let's support DELETE method for actual delete 
        // or just rely on PUT to set isActive=false. 
        // Let's implement actual DELETE for now, but Admin should probably prefer deactivation if used.
        // Actually, let's just do a soft delete (deactivate) or hard delete. 
        // Given the prompt "Delete/Deactivate", I'll implement DELETE as hard delete for now, 
        // assuming "Deactivate" is done via PUT.

        const treatmentType = await TreatmentType.findByIdAndDelete(id);

        if (!treatmentType) {
            return NextResponse.json(
                { error: 'Treatment type not found' },
                { status: 404 }
            );
        }

        logger.info(`Treatment type deleted: ${treatmentType.name} by ${user.mobileNumber}`);

        return NextResponse.json({
            success: true,
            message: 'Treatment type deleted successfully',
        });
    } catch (error) {
        logger.error('Error deleting treatment type:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

export const PUT = withAuth(handlePut);
export const DELETE = withAuth(handleDelete);
