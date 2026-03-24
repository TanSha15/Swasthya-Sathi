
import User from '../models/User.js';
import generateToken from '../utils/generateToken.js';


//REGISTRATION------------------------------------------------------------------
export const registerUser = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;


        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }


        let assignedRole = 'patient';
        if (role === 'doctor') {
            assignedRole = 'doctor';
        }

        const user = await User.create({
            name,
            email,
            password,
            role: assignedRole, 
        });

        if (user) {
            res.status(201).json({
                message: 'User registered successfully',
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role, 
                token: generateToken(user._id),
            });
        } else {
            res.status(400).json({ message: 'Invalid user data' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


//LOGIN-----------------------------------------------------------------------------------------
export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });


        if (user && (await user.matchPassword(password))) {
            res.status(200).json({
                message: 'Login successful',
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                token: generateToken(user._id),
            });
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


//GET PROFILE--------------------------------------------------------------------------------------
export const getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);

        if (user) {
            res.status(200).json({
                message: 'User profile retrieved successfully',
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                avatar: user.avatar,
                phone: user.phone,
            });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};