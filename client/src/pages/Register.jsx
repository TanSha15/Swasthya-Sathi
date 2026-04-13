// src/pages/Register.jsx
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../lib/axios';
import useAuthStore from '../store/authStore';
import { toast } from 'react-toastify';

const Register = () => {
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login); 
  
  const [isLoading, setIsLoading] = useState(false);
  const [role, setRole] = useState('patient'); 
  
  // Updated to match your exact schema fields!
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    specialty: 'General Physician',
    experience: '',
    consultationFee: '',
    licenseNumber: ''
  });

  // Dedicated state for the Multer file upload
  const [licenseFile, setLicenseFile] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setLicenseFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // 1. Register the base User (Sends JSON)
      const registerPayload = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: role,
      };

      const response = await api.post('/auth/register', registerPayload);
      // The API returns the user properties directly on the response data
      const userData = response.data; 
      const token = userData.token;
      
      // 2. If Doctor, upload the Doctor Profile data separately using the new token
      if (role === 'doctor') {
        const profileData = new FormData();
        profileData.append('specialty', formData.specialty);
        profileData.append('experience', Number(formData.experience));
        profileData.append('consultationFee', Number(formData.consultationFee));
        profileData.append('licenseNumber', formData.licenseNumber);
        if (licenseFile) {
          profileData.append('licenseDocument', licenseFile);
        }

        await api.post('/doctors/profile', profileData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}` // Manually provide token for this request
          },
        });
      }

      // 3. Log the user in
      if (login) {
          login(userData, token);
      } else {
          localStorage.setItem('token', token);
          localStorage.setItem('user', JSON.stringify(userData));
          useAuthStore.setState({ user: userData, isAuthenticated: true, token });
      }

      toast.success('Account created successfully!');
      
      if (role === 'doctor') {
        navigate('/doctor-dashboard');
      } else {
        navigate('/dashboard');
      }

    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create account.');
      console.error("Registration Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface flex font-sans h-screen overflow-hidden">
      
      {/* Left Form Pane */}
      <div className="flex-1 flex flex-col p-6 sm:p-12 relative overflow-y-auto custom-scrollbar">
        <Link to="/" className="absolute top-8 left-8 text-sm font-semibold text-textLight hover:text-primary transition-colors z-10">← Back to Home</Link>
        <div className="w-full max-w-md mx-auto animate-fade-in-up my-auto pt-12 lg:pt-4 pb-8">
          
          <div className="mb-8 text-center lg:text-left">
            <h1 className="text-4xl font-extrabold text-textDark mb-2">Create Account</h1>
            <p className="text-textLight text-lg">Join our network of patients and verified specialists.</p>
          </div>

          <div className="flex bg-gray-100 p-1.5 rounded-2xl mb-8 border border-gray-200 shadow-inner">
            <button
              type="button"
              onClick={() => setRole('patient')}
              className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all ${
                role === 'patient' ? 'bg-white text-primary shadow-sm scale-[1.02]' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              I am a Patient
            </button>
            <button
              type="button"
              onClick={() => setRole('doctor')}
              className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all ${
                role === 'doctor' ? 'bg-white text-primary shadow-sm scale-[1.02]' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              I am a Doctor
            </button>
          </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-textDark mb-1">Full Name</label>
            <input type="text" name="name" required value={formData.name} onChange={handleChange} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/50 outline-none" />
          </div>

          <div>
            <label className="block text-sm font-semibold text-textDark mb-1">Email</label>
            <input type="email" name="email" required value={formData.email} onChange={handleChange} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/50 outline-none" />
          </div>

          <div>
            <label className="block text-sm font-semibold text-textDark mb-1">Password</label>
            <input type="password" name="password" required minLength="6" value={formData.password} onChange={handleChange} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/50 outline-none" />
          </div>

          {/* --- DOCTOR SPECIFIC FIELDS --- */}
          {role === 'doctor' && (
            <div className="pt-4 mt-4 border-t border-gray-100 space-y-4 animate-fade-in-up">
              <h3 className="text-sm font-bold text-primary uppercase tracking-wider">Medical Credentials</h3>
              
              <div>
                <label className="block text-sm font-semibold text-textDark mb-1">Specialty</label>
                <select name="specialty" value={formData.specialty} onChange={handleChange} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/50 outline-none bg-white">
                  <option>General Physician</option>
                  <option>Cardiologist</option>
                  <option>Dermatologist</option>
                  <option>Neurologist</option>
                  <option>Pediatrician</option>
                  <option>Psychiatrist</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-textDark mb-1">Medical License Number</label>
                <input type="text" name="licenseNumber" required={role === 'doctor'} value={formData.licenseNumber} onChange={handleChange} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/50 outline-none" placeholder="e.g. MED-123456" />
              </div>

              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="block text-sm font-semibold text-textDark mb-1">Experience (Yrs)</label>
                  <input type="number" name="experience" required={role === 'doctor'} min="0" value={formData.experience} onChange={handleChange} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/50 outline-none" />
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-semibold text-textDark mb-1">Fee (₹)</label>
                  <input type="number" name="consultationFee" required={role === 'doctor'} min="0" value={formData.consultationFee} onChange={handleChange} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/50 outline-none" />
                </div>
              </div>

              {/* Multer File Upload Input */}
              <div>
                <label className="block text-sm font-semibold text-textDark mb-1">Upload License Document (PDF/Image)</label>
                <input 
                  type="file" 
                  name="licenseDocument" 
                  accept=".pdf, image/jpeg, image/png"
                  onChange={handleFileChange} 
                  required={role === 'doctor'}
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/50 outline-none text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20 transition-all" 
                />
              </div>
            </div>
          )}

          <button type="submit" disabled={isLoading} className="w-full bg-primary hover:bg-primaryDark text-white py-4 rounded-2xl font-bold text-lg transition-all shadow-lg hover:shadow-primary/30 hover:-translate-y-1 mt-8 disabled:opacity-50 disabled:transform-none">
            {isLoading ? 'Processing...' : `Sign Up as ${role === 'doctor' ? 'Doctor' : 'Patient'}`}
          </button>
        </form>

        <p className="text-center text-textLight mt-8">
            Already have an account? <Link to="/login" className="text-primary font-bold hover:underline">Sign in securely</Link>
        </p>

        </div>
      </div>

      {/* Right Visual Pane */}
      <div className="hidden lg:flex w-5/12 bg-gradient-to-br from-secondary to-teal-800 p-12 flex-col justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10 mix-blend-overlay"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-emerald-400/20 blur-[100px] pointer-events-none"></div>
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-white/10 blur-[100px] pointer-events-none"></div>
        
        <div className="relative z-10 flex flex-col items-center text-center">
          <div className="flex items-center gap-3 mb-12">
            <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center text-secondary shadow-2xl font-black text-3xl">
              S
            </div>
            <span className="text-3xl font-extrabold text-white tracking-tight">Swasthya-Sathi</span>
          </div>
          <h1 className="text-5xl lg:text-6xl font-extrabold text-white mb-6 leading-[1.1] tracking-tight">Join the healthcare<br/>revolution.</h1>
          <p className="text-white/90 text-xl leading-relaxed max-w-md mt-6">Whether you're seeking care or providing it, our platform empowers you with the best tools in modern medicine.</p>
        </div>
      </div>

    </div>
  );
};

export default Register;