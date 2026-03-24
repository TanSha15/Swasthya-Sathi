import DoctorProfile from '../models/DoctorProfile.js';


export const getPendingDoctors = async (req, res) => {
    try {
        const pendingDoctors = await DoctorProfile.find({ isApproved: false })
            .populate('userId', 'name email');

        res.status(200).json({ 
            message: 'Pending doctors retrieved successfully', 
            doctors: pendingDoctors 
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


export const approveDoctor = async (req, res) => {
    try {
        const doctor = await DoctorProfile.findByIdAndUpdate(
            req.params.id,
            { isApproved: true },
            { new: true } 
        );

        if (!doctor) {
            return res.status(404).json({ message: 'Doctor profile not found' });
        }

        res.status(200).json({ 
            message: 'Doctor approved successfully and is now live on the platform', 
            doctor 
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};