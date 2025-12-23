import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ITreatmentType extends Document {
    name: string;
    price: number;
    description?: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const TreatmentTypeSchema = new Schema<ITreatmentType>(
    {
        name: {
            type: String,
            required: [true, 'Name is required'],
            unique: true,
            trim: true,
        },
        price: {
            type: Number,
            required: [true, 'Price is required'],
            min: 0,
            default: 0,
        },
        description: {
            type: String,
            trim: true,
        },
        isActive: {
            type: Boolean,
            default: true,
        },
    },
    {
        timestamps: true,
    }
);

TreatmentTypeSchema.index({ name: 1 });
TreatmentTypeSchema.index({ isActive: 1 });

const TreatmentType: Model<ITreatmentType> =
    mongoose.models.TreatmentType || mongoose.model<ITreatmentType>('TreatmentType', TreatmentTypeSchema);

export default TreatmentType;
