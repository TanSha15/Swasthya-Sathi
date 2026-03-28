// routes/aiRoutes.js
import express from 'express';
import { analyzeSymptoms } from '../controllers/aiController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// @route   POST /api/ai/analyze
// @access  Private (Requires valid token)
router.post('/analyze', protect, analyzeSymptoms);

export default router;