import crypto from 'crypto';
// controllers/appointmentController.js
import Appointment from '../models/Appointment.js';
import DoctorProfile from '../models/DoctorProfile.js';

// @desc    Book a new appointment
// @route   POST /api/appointments
// @access  Private (Patient only ideally)
export const bookAppointment = async (req, res) => {
    try {
        const { doctorId, date, timeSlot, reasonForVisit } = req.body;

        // 1. Verify the doctor actually exists
        const doctor = await DoctorProfile.findById(doctorId);
        if (!doctor) {
            return res.status(404).json({ message: 'Doctor profile not found' });
        }

        // 2. Create the appointment
        const appointment = await Appointment.create({
            patientId: req.user._id, // Pulled securely from the JWT token
            doctorId,
            date,
            timeSlot,
            reasonForVisit
        });

        res.status(201).json({
            message: 'Appointment booked successfully',
            appointment
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get appointments for the logged-in user
// @route   GET /api/appointments
// @access  Private (Patients and Doctors)
export const getMyAppointments = async (req, res) => {
    try {
        let appointments;

        if (req.user.role === 'patient') {
            // Find appointments where this user is the patient
            // We use .populate() to fetch the doctor's name so the frontend can display it
            appointments = await Appointment.find({ patientId: req.user._id })
                .populate({
                    path: 'doctorId',
                    populate: { path: 'userId', select: 'name email phone' } 
                });
        } 
        else if (req.user.role === 'doctor') {
            // Find the doctor's profile ID first
            const doctorProfile = await DoctorProfile.findOne({ userId: req.user._id });
            
            if (!doctorProfile) {
                return res.status(404).json({ message: 'Doctor profile not found.' });
            }

            // Find appointments specifically for this doctor's profile
            appointments = await Appointment.find({ doctorId: doctorProfile._id })
                .populate('patientId', 'name email phone'); 
        }

        res.status(200).json({
            count: appointments?.length || 0,
            appointments
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update appointment status (Confirm, Cancel, Complete)
// @route   PUT /api/appointments/:id/status
// @access  Private (Doctor)
// @desc    Update appointment status and generate video link
// @route   PUT /api/appointments/:id/status
// @access  Private (Doctor)
export const updateAppointmentStatus = async (req, res) => {
    try {
        const { status } = req.body; 

        const appointment = await Appointment.findById(req.params.id);

        if (!appointment) {
            return res.status(404).json({ message: 'Appointment not found' });
        }

        // Update the status
        appointment.status = status;

        // Automatically generate a Jitsi video meeting link ONLY when confirmed
        if (status === 'confirmed' && !appointment.meetingLink) {
            // Generate a secure, random 10-character string
            const secureRoomId = crypto.randomBytes(5).toString('hex');
            
            // Create the unique Swasthya Sathi meeting URL
            appointment.meetingLink = `https://meet.jit.si/SwasthyaSathi-${secureRoomId}`;
        }

        // If the appointment is cancelled or completed, we might want to clear the link
        if (status === 'cancelled' || status === 'completed') {
            appointment.meetingLink = null;
        }

        const updatedAppointment = await appointment.save();

        res.status(200).json({
            message: `Appointment successfully marked as ${status}`,
            appointment: updatedAppointment
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Add doctor notes/prescription to an appointment
// @route   PUT /api/appointments/:id/notes
// @access  Private (Doctor only)
export const addDoctorNotes = async (req, res) => {
    try {
        const { doctorNotes } = req.body;

        // Security check: Only doctors should be writing notes
        if (req.user.role !== 'doctor') {
            return res.status(403).json({ message: 'Access denied. Only doctors can add notes.' });
        }

        const appointment = await Appointment.findById(req.params.id);

        if (!appointment) {
            return res.status(404).json({ message: 'Appointment not found' });
        }

        // Add the notes and automatically mark the appointment as completed
        appointment.doctorNotes = doctorNotes;
        appointment.status = 'completed'; 
        appointment.meetingLink = null; // Clear the meeting link since the call is over

        const updatedAppointment = await appointment.save();

        res.status(200).json({
            message: 'Notes added and appointment marked as completed',
            appointment: updatedAppointment
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};