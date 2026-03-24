import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinary from '../config/cloudinary.js';

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'swasthya_sathi_licenses', 
        allowed_formats: ['jpg', 'jpeg', 'png', 'pdf'], 
    },
});

const upload = multer({ storage });

export default upload;