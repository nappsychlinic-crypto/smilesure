import mongoose, { Schema, Document, Model } from 'mongoose';

export enum UserRole {
    ADMIN = 'ADMIN',
    FRONT_DESK = 'FRONT_DESK',
    USER = 'USER',
}

export interface IUser extends Document {
    _id: mongoose.Types.ObjectId;
    name: string;
    mobileNumber: string;
    countryCode: string;
    email?: string;
    role: UserRole;
    passwordHash: string;
    isActive: boolean;
    mustResetPassword: boolean;
    resetPasswordToken?: string;
    resetPasswordExpires?: Date;
    createdAt: Date;
    updatedAt: Date;
    createdBy?: mongoose.Types.ObjectId;
    lastModifiedBy?: mongoose.Types.ObjectId;
}

const UserSchema = new Schema<IUser>(
    {
        name: {
            type: String,
            required: [true, 'Name is required'],
            trim: true,
        },
        mobileNumber: {
            type: String,
            required: [true, 'Mobile number is required'],
            unique: true,
            trim: true,
            validate: {
                validator: function (v: string) {
                    return /^\d{10}$/.test(v);
                },
                message: 'Mobile number must be exactly 10 digits'
            }
        },
        countryCode: {
            type: String,
            default: '+91',
            trim: true,
        },
        email: {
            type: String,
            sparse: true,
            lowercase: true,
            trim: true,
        },
        role: {
            type: String,
            enum: Object.values(UserRole),
            default: UserRole.USER,
        },
        passwordHash: {
            type: String,
            required: true,
        },
        isActive: {
            type: Boolean,
            default: true,
        },
        mustResetPassword: {
            type: Boolean,
            default: false,
        },
        resetPasswordToken: String,
        resetPasswordExpires: Date,
        createdBy: {
            type: Schema.Types.ObjectId,
            ref: 'User',
        },
        lastModifiedBy: {
            type: Schema.Types.ObjectId,
            ref: 'User',
        },
    },
    {
        timestamps: true,
    }
);

// Index for role lookup (email is already indexed via unique: true)
UserSchema.index({ role: 1 });

const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);

export default User;
