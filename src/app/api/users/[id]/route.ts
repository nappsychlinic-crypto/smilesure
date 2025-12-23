import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import User, { UserRole } from '@/models/User';
import { withAuth, AuthenticatedRequest } from '@/lib/api-middleware';
import logger from '@/lib/logger';

async function handlePatch(
    request: NextRequest,
    context: { params: Promise<Record<string, string>> },
    { user }: AuthenticatedRequest
) {
    const startTime = Date.now();
    const { id } = await context.params;
    const path = `/api/users/${id}`;

    try {
        logger.api.request('PATCH', path, { userId: user.userId });

        const body = await request.json();
        const { name, phone, isActive } = body;

        await connectDB();

        const targetUser = await User.findById(id);

        if (!targetUser) {
            logger.warn('Update attempt for non-existent user', { id });
            return NextResponse.json(
                { error: 'User not found' },
                { status: 404 }
            );
        }

        // Authorization checks
        const isAdmin = user.role === UserRole.ADMIN;
        const isSelfUpdate = user.userId === id;

        // Only admin can update other users
        if (!isAdmin && !isSelfUpdate) {
            logger.warn('Unauthorized user update attempt', {
                userId: user.userId,
                targetId: id
            });
            return NextResponse.json(
                { error: 'Forbidden - Cannot update other users' },
                { status: 403 }
            );
        }

        // Only admin can change isActive status
        if (isActive !== undefined && !isAdmin) {
            logger.warn('Non-admin attempted to change isActive status', { userId: user.userId });
            return NextResponse.json(
                { error: 'Forbidden - Only admins can activate/deactivate users' },
                { status: 403 }
            );
        }

        // Build update object
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const updates: Record<string, any> = {
            lastModifiedBy: user.userId,
        };

        if (name !== undefined) updates.name = name;
        if (phone !== undefined) updates.phone = phone;
        if (isActive !== undefined && isAdmin) updates.isActive = isActive;

        const updatedUser = await User.findByIdAndUpdate(
            id,
            updates,
            { new: true }
        ).select('-passwordHash -resetPasswordToken -resetPasswordExpires');

        logger.info('User updated', {
            userId: id,
            updatedBy: user.userId,
            updates: Object.keys(updates).filter(k => k !== 'lastModifiedBy')
        });
        logger.api.response('PATCH', path, 200, Date.now() - startTime);

        return NextResponse.json({
            success: true,
            data: updatedUser,
        });
    } catch (error) {
        logger.api.error('PATCH', path, error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

async function handleGet(
    request: NextRequest,
    context: { params: Promise<Record<string, string>> },
    { user }: AuthenticatedRequest
) {
    const { id } = await context.params;
    const path = `/api/users/${id}`;

    try {
        logger.api.request('GET', path, { userId: user.userId });

        await connectDB();

        const targetUser = await User.findById(id)
            .select('-passwordHash -resetPasswordToken -resetPasswordExpires')
            .lean();

        if (!targetUser) {
            return NextResponse.json(
                { error: 'User not found' },
                { status: 404 }
            );
        }

        // Authorization checks
        const isAdmin = user.role === UserRole.ADMIN;
        const isFrontDesk = user.role === UserRole.FRONT_DESK;
        const isSelf = user.userId === id;

        // Users can only view themselves, front desk can view patients, admin can view all
        if (!isAdmin && !isSelf) {
            if (isFrontDesk && targetUser.role !== UserRole.USER) {
                return NextResponse.json(
                    { error: 'Forbidden' },
                    { status: 403 }
                );
            } else if (!isFrontDesk) {
                return NextResponse.json(
                    { error: 'Forbidden' },
                    { status: 403 }
                );
            }
        }

        return NextResponse.json({
            success: true,
            data: targetUser,
        });
    } catch (error) {
        logger.api.error('GET', path, error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

export const PATCH = withAuth(handlePatch);
export const GET = withAuth(handleGet);
