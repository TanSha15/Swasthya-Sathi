// routes/aiRoutes.js
import express from 'express';
import { analyzeSymptoms, getAiHistory } from '../controllers/aiController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/analyze', protect, analyzeSymptoms);
router.get('/history', protect, getAiHistory);

export default router;