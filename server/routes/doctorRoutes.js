import express from 'express';
import { updateDoctorProfile, getDoctors } from '../controllers/doctorController.js';
import { protect } from '../middleware/authMiddleware.js';
import { authorize } from '../middleware/roleMiddleware.js';
import upload from '../middleware/uploadMiddleware.js';

const router = express.Router();


router.get('/', getDoctors);


router.post('/profile', protect, authorize('doctor'), upload.single('licenseDocument'), updateDoctorProfile);

export default router;