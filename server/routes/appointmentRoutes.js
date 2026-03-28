// routes/appointmentRoutes.js
import express from 'express';
import { 
    bookAppointment, 
    getMyAppointments, 
    updateAppointmentStatus,
    addDoctorNotes
} from '../controllers/appointmentController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// All appointment routes require the user to be logged in
router.use(protect);

router.post('/', bookAppointment);
router.get('/', getMyAppointments);
router.put('/:id/status', updateAppointmentStatus);
router.put('/:id/notes', addDoctorNotes);

export default router;