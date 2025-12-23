import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import User, { UserRole } from '@/models/User';
import { hashPassword } from '@/lib/auth';
import { withAuth, withAdminAuth, AuthenticatedRequest } from '@/lib/api-middleware';
import logger from '@/lib/logger';

// GET /api/users - List users with filtering
export const GET = withAuth(async (
    request: NextRequest,
    context: { params: Promise<Record<string, string>> },
    auth: AuthenticatedRequest
) => {
    const startTime = Date.now();
    const path = '/api/users';
    const user = auth.user;

    try {
        logger.api.request('GET', path);

        const { searchParams } = new URL(request.url);
        const role = searchParams.get('role');
        const isActive = searchParams.get('isActive');
        const search = searchParams.get('search');
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '50');

        await connectDB();

        // Build query based on user role
        const query: Record<string, unknown> = {};

        // Role-based filtering
        if (user.role === UserRole.ADMIN) {
            // Admin can see all users
            if (role) query.role = role;
        } else if (user.role === UserRole.FRONT_DESK) {
            // Front desk can only see patients
            query.role = UserRole.USER;
        } else {
            // Regular users can only see themselves
            query._id = user.userId;
        }

        // Active status filter
        if (isActive !== null && isActive !== undefined) {
            query.isActive = isActive === 'true';
        }

        // Search filter
        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { mobileNumber: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } },
            ];
        }

        const skip = (page - 1) * limit;

        const [users, total] = await Promise.all([
            User.find(query)
                .select('-passwordHash -resetPasswordToken -resetPasswordExpires')
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit),
            User.countDocuments(query),
        ]);

        logger.api.response('GET', path, 200, Date.now() - startTime);

        return NextResponse.json({
            success: true,
            data: users,
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit),
            },
        });
    } catch (error) {
        logger.api.error('GET', path, error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
});

// POST /api/users - Create a new user (Admin only)
export const POST = withAdminAuth(async (
    request: NextRequest,
    context: { params: Promise<Record<string, string>> },
    auth: AuthenticatedRequest
) => {
    const startTime = Date.now();
    const path = '/api/users';
    const currentUser = auth.user;

    try {
        logger.api.request('POST', path);

        const body = await request.json();
        const { name, mobileNumber, countryCode = '+91', email, password, role } = body;

        if (!name || !mobileNumber || !password) {
            return NextResponse.json(
                { error: 'Name, mobile number, and password are required' },
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

        if (password.length < 8) {
            return NextResponse.json(
                { error: 'Password must be at least 8 characters' },
                { status: 400 }
            );
        }

        // Validate role
        const validRoles = [UserRole.USER, UserRole.FRONT_DESK, UserRole.ADMIN];
        const userRole = role || UserRole.USER;
        if (!validRoles.includes(userRole)) {
            return NextResponse.json(
                { error: 'Invalid role' },
                { status: 400 }
            );
        }

        await connectDB();

        // Check if user already exists by mobile number
        const existingUser = await User.findOne({ mobileNumber });
        if (existingUser) {
            return NextResponse.json(
                { error: 'A user with this mobile number already exists' },
                { status: 400 }
            );
        }

        // Hash password and create user
        const passwordHash = await hashPassword(password);

        const newUser = await User.create({
            name,
            mobileNumber,
            countryCode,
            email: email?.toLowerCase(),
            role: userRole,
            passwordHash,
            isActive: true,
            mustResetPassword: false,
            createdBy: currentUser.userId,
            lastModifiedBy: currentUser.userId,
        });

        logger.info('User created successfully', {
            userId: newUser._id.toString(),
            mobileNumber: newUser.mobileNumber,
            role: newUser.role,
            createdBy: currentUser.mobileNumber
        });
        logger.api.response('POST', path, 201, Date.now() - startTime);

        return NextResponse.json({
            success: true,
            data: {
                _id: newUser._id,
                name: newUser.name,
                mobileNumber: newUser.mobileNumber,
                countryCode: newUser.countryCode,
                email: newUser.email,
                role: newUser.role,
                isActive: newUser.isActive,
            },
        }, { status: 201 });
    } catch (error) {
        logger.api.error('POST', path, error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
});
