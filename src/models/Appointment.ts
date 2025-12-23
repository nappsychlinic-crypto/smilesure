import mongoose, { Schema, Document, Model } from 'mongoose';

export enum AppointmentStatus {
    SCHEDULED = 'Scheduled',
    CONFIRMED = 'Confirmed',
    CHECKED_IN = 'Checked-In',
    IN_TREATMENT = 'In Treatment',
    COMPLETED = 'Completed',
    CANCELLED = 'Cancelled',
    NO_SHOW = 'No-Show',
}

export interface IAppointment extends Document {
    _id: mongoose.Types.ObjectId;
    patientId: mongoose.Types.ObjectId;
    createdBy: mongoose.Types.ObjectId;
    lastModifiedBy: mongoose.Types.ObjectId;
    appointmentDateTime: Date;
    status: AppointmentStatus;
    treatmentType: string;
    feeAmount?: number;
    notes?: string;
    reminderSent: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const AppointmentSchema = new Schema<IAppointment>(
    {
        patientId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: [true, 'Patient is required'],
        },
        createdBy: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        lastModifiedBy: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        appointmentDateTime: {
            type: Date,
            required: [true, 'Appointment date and time is required'],
        },
        status: {
            type: String,
            enum: Object.values(AppointmentStatus),
            default: AppointmentStatus.SCHEDULED,
        },
        treatmentType: {
            type: String,
            required: [true, 'Treatment type is required'],
            trim: true,
        },
        feeAmount: {
            type: Number,
            min: 0,
        },
        notes: {
            type: String,
            trim: true,
        },
        reminderSent: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    }
);

// Indexes as required by PRD
AppointmentSchema.index({ appointmentDateTime: 1 });
AppointmentSchema.index({ status: 1 });
AppointmentSchema.index({ patientId: 1 });
AppointmentSchema.index({ createdBy: 1 });

const Appointment: Model<IAppointment> =
    mongoose.models.Appointment || mongoose.model<IAppointment>('Appointment', AppointmentSchema);

export default Appointment;
