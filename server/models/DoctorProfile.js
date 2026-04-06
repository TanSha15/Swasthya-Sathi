import mongoose from 'mongoose';

const doctorProfileSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User', 
            required: true,
        },
        specialty: { 
            type: String, 
            required: true 
        },
        qualifications: [{ 
            type: String 
        }], 
        experience: { 
            type: Number 
        }, 
        licenseNumber: { 
            type: String, 
            unique: true, 
            required: true 
        },
        licenseDocument: { 
            type: String 
        }, 
        consultationFee: { 
            type: Number, 
            required: true 
        },
        bio: { 
            type: String 
        },
        availability: [
            {
                day: { type: String }, 
                startTime: { type: String }, 
                endTime: { type: String }, 
                slotDuration: { type: Number, default: 30 },
            },
        ],
        averageRating: { 
            type: Number, 
            default: 0 
        },
        totalReviews: { 
            type: Number, 
            default: 0 
        },
        isApproved: { 
            type: Boolean, 
            default: true 
        }, 
        isActive: { 
            type: Boolean, 
            default: true 
        },
    },
    {
        timestamps: true,
    }
);

const DoctorProfile = mongoose.model('DoctorProfile', doctorProfileSchema);

export default DoctorProfile;