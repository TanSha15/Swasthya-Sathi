// src/pages/Login.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../store/authStore';

const Login = () => {
  const navigate = useNavigate();
  const { loginUser, isLoading } = useAuthStore();
  
  // React state to hold the typed input
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleRealLogin = async (e) => {
    e.preventDefault();
    
    // Call our real Zustand API function
    const success = await loginUser(email, password);
    
    // If the API call worked, route dynamically based on role
    if (success) {
      // get latest state snapshot to get the populated user
      const currentUser = useAuthStore.getState().user;
      if (currentUser?.role === 'doctor') {
        navigate('/doctor-dashboard');
      } else {
        navigate('/dashboard');
      }
    }
  };

  return (
    <div className="min-h-screen bg-surface flex items-center justify-center p-6">
      <div className="bg-white p-8 rounded-2xl shadow-soft w-full max-w-md">
        <h2 className="text-2xl font-bold text-textDark text-center mb-2">Welcome Back</h2>
        <p className="text-center text-textLight mb-6">Login to Swasthya Sathi</p>
        
        <form onSubmit={handleRealLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-textDark mb-1">Email</label>
            <input 
              type="email" 
              required 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50" 
              placeholder="patient@example.com" 
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-textDark mb-1">Password</label>
            <input 
              type="password" 
              required 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50" 
              placeholder="••••••••" 
            />
          </div>
          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full bg-primary hover:bg-primaryDark text-white py-2 rounded-lg font-semibold transition-colors mt-4 disabled:opacity-50"
          >
            {isLoading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;