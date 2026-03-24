import DoctorProfile from '../models/DoctorProfile.js';


export const updateDoctorProfile = async (req, res) => {
    try {
        const { specialty, qualifications, experience, licenseNumber, consultationFee, bio, availability } = req.body;
        
        let profileData = {
            userId: req.user._id,
            specialty,
            qualifications: qualifications ? qualifications.split(',') : [],
            experience,
            licenseNumber,
            consultationFee,
            bio,
            availability: availability ? JSON.parse(availability) : []
        };


        if (req.file) {
            profileData.licenseDocument = req.file.path;
        }


        let profile = await DoctorProfile.findOne({ userId: req.user._id });

        if (profile) {
  
            profile = await DoctorProfile.findOneAndUpdate(
                { userId: req.user._id },
                { $set: profileData },
                { new: true }
            );
            return res.status(200).json({ message: 'Profile updated successfully', profile });
        }

        profile = await DoctorProfile.create(profileData);
        res.status(201).json({ 
            message: 'Profile created successfully. Pending admin approval.', 
            profile 
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


export const getDoctors = async (req, res) => {
    try {
        const doctors = await DoctorProfile.find({ isApproved: true, isActive: true })
            .populate('userId', 'name email avatar');
            
        res.status(200).json({ message: 'Doctors retrieved successfully', doctors });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};