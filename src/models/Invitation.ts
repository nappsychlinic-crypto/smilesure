import mongoose, { Schema, Document, Model } from 'mongoose';
import { UserRole } from './User';

export interface IInvitation extends Document {
    _id: mongoose.Types.ObjectId;
    mobileNumber: string;
    countryCode: string;
    role: UserRole;
    inviteToken: string;
    expiresAt: Date;
    accepted: boolean;
    createdBy: mongoose.Types.ObjectId;
    lastModifiedBy?: mongoose.Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}

const InvitationSchema = new Schema<IInvitation>(
    {
        mobileNumber: {
            type: String,
            required: [true, 'Mobile number is required'],
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
        role: {
            type: String,
            enum: Object.values(UserRole),
            required: true,
        },
        inviteToken: {
            type: String,
            required: true,
            unique: true,
        },
        expiresAt: {
            type: Date,
            required: true,
        },
        accepted: {
            type: Boolean,
            default: false,
        },
        createdBy: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
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

InvitationSchema.index({ mobileNumber: 1 });
InvitationSchema.index({ inviteToken: 1 });

const Invitation: Model<IInvitation> =
    mongoose.models.Invitation || mongoose.model<IInvitation>('Invitation', InvitationSchema);

export default Invitation;
