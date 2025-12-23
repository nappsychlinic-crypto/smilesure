import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import User, { UserRole } from '@/models/User';
import Invitation from '@/models/Invitation';
import { withStaffAuth, AuthenticatedRequest } from '@/lib/api-middleware';
import { generateResetToken, getResetTokenExpiry } from '@/lib/auth';
import logger from '@/lib/logger';
import crypto from 'crypto';

async function handlePost(
    request: NextRequest,
    _context: { params: Promise<Record<string, string>> },
    { user }: AuthenticatedRequest
) {
    const startTime = Date.now();
    const path = '/api/users/invite';

    try {
        logger.api.request('POST', path, { userId: user.userId });

        const body = await request.json();
        const { mobileNumber, countryCode = '+91', role, name } = body;

        if (!mobileNumber) {
            logger.warn('Invite attempt with missing mobile number');
            return NextResponse.json(
                { error: 'Mobile number is required' },
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

        // Validate role
        const inviteRole = role || UserRole.USER;
        if (!Object.values(UserRole).includes(inviteRole)) {
            logger.warn('Invite attempt with invalid role', { role });
            return NextResponse.json(
                { error: 'Invalid role' },
                { status: 400 }
            );
        }

        // Only admins can invite non-patients
        if (inviteRole !== UserRole.USER && user.role !== UserRole.ADMIN) {
            logger.warn('Front desk attempted to invite non-patient', {
                attemptedRole: inviteRole,
                userId: user.userId
            });
            return NextResponse.json(
                { error: 'Only admins can invite staff members' },
                { status: 403 }
            );
        }

        await connectDB();

        // Check if user already exists
        const existingUser = await User.findOne({ mobileNumber });
        if (existingUser) {
            logger.warn('Invite attempt for existing user', { mobileNumber });
            return NextResponse.json(
                { error: 'A user with this mobile number already exists' },
                { status: 409 }
            );
        }

        // Check for existing pending invitation
        const existingInvitation = await Invitation.findOne({
            mobileNumber,
            accepted: false,
            expiresAt: { $gt: new Date() },
        });

        if (existingInvitation) {
            logger.warn('Invite attempt for existing invitation', { mobileNumber });
            return NextResponse.json(
                { error: 'An invitation is already pending for this mobile number' },
                { status: 409 }
            );
        }

        // Generate invite token
        const inviteToken = crypto.randomBytes(32).toString('hex');
        const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

        const invitation = await Invitation.create({
            mobileNumber,
            countryCode,
            role: inviteRole,
            inviteToken,
            expiresAt,
            accepted: false,
            createdBy: user.userId,
        });

        // TODO: Send invitation via WhatsApp/SMS
        logger.info('Invitation created', {
            invitationId: invitation._id.toString(),
            mobileNumber,
            role: inviteRole,
            invitedBy: user.userId,
            token: inviteToken, // Remove in production
        });

        logger.api.response('POST', path, 201, Date.now() - startTime);

        return NextResponse.json({
            success: true,
            message: 'Invitation sent successfully',
            data: {
                id: invitation._id.toString(),
                mobileNumber: invitation.mobileNumber,
                countryCode: invitation.countryCode,
                role: invitation.role,
                expiresAt: invitation.expiresAt,
            },
            // Development only
            ...(process.env.NODE_ENV !== 'production' && { inviteToken }),
        }, { status: 201 });
    } catch (error) {
        logger.api.error('POST', path, error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

export const POST = withStaffAuth(handlePost);
