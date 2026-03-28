// models/Appointment.js
import mongoose from 'mongoose';

const appointmentSchema = new mongoose.Schema(
    {
        patientId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User', // Links to the patient's User account
            required: true,
        },
        doctorId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'DoctorProfile', // Links specifically to the Doctor's professional profile
            required: true,
        },
        date: {
            type: Date,
            required: true,
        },
        timeSlot: {
            type: String,
            required: true, // e.g., "10:00 AM - 10:30 AM"
        },
        status: {
            type: String,
            enum: ['pending', 'confirmed', 'cancelled', 'completed'],
            default: 'pending',
        },
        reasonForVisit: {
            type: String,
            required: true,
        },
        meetingLink: {
            type: String, // We will generate this when we integrate video calls
        },
        doctorNotes: {
            type: String, // For prescriptions or notes after the consultation
        },
    },
    {
        timestamps: true,
    }
);

const Appointment = mongoose.model('Appointment', appointmentSchema);

export default Appointment;