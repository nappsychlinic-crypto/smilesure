import mongoose, { Schema, Document, Model } from 'mongoose';

export enum PaymentMode {
    CASH = 'CASH',
    ONLINE = 'ONLINE',
}

export interface IPayment extends Document {
    _id: mongoose.Types.ObjectId;
    appointmentId: mongoose.Types.ObjectId;
    patientId: mongoose.Types.ObjectId;
    amount: number;
    paymentMode: PaymentMode;
    transactionNumber?: string; // Transaction Number for online payments
    paymentDate: Date;
    createdBy: mongoose.Types.ObjectId;
    lastModifiedBy?: mongoose.Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}

const PaymentSchema = new Schema<IPayment>(
    {
        appointmentId: {
            type: Schema.Types.ObjectId,
            ref: 'Appointment',
            required: true,
        },
        patientId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        amount: {
            type: Number,
            required: [true, 'Amount is required'],
            min: 0,
        },
        paymentMode: {
            type: String,
            enum: Object.values(PaymentMode),
            required: true,
        },
        paymentDate: {
            type: Date,
            required: true,
            default: Date.now,
        },
        transactionNumber: {
            type: String,
            trim: true,
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

PaymentSchema.index({ appointmentId: 1 });
PaymentSchema.index({ patientId: 1 });
PaymentSchema.index({ paymentDate: 1 });

const Payment: Model<IPayment> =
    mongoose.models.Payment || mongoose.model<IPayment>('Payment', PaymentSchema);

export default Payment;
