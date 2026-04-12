import mongoose from 'mongoose';

const aiAssessmentSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    symptoms: {
        type: [String],
        required: true
    },
    assessmentRaw: {
        type: Object,
        required: true
    }
}, { timestamps: true });

const AIAssessment = mongoose.model('AIAssessment', aiAssessmentSchema);
export default AIAssessment;
