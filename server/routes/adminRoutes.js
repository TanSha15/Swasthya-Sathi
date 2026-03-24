import express from 'express';
import { getPendingDoctors, approveDoctor } from '../controllers/adminController.js';
import { protect } from '../middleware/authMiddleware.js';
import { authorize } from '../middleware/roleMiddleware.js';

const router = express.Router();

router.get('/doctors/pending', protect, authorize('admin'), getPendingDoctors);
router.put('/doctors/:id/approve', protect, authorize('admin'), approveDoctor);

export default router;