// src/components/Navbar.jsx
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuthStore from '../store/authStore'; // <-- Import your new store!

const Navbar = () => {
  const navigate = useNavigate();
  
  // Pull exactly what we need from Zustand
  const { isAuthenticated, logout } = useAuthStore(); 

  const handleLogout = () => {
    logout(); // Call the Zustand logout action
    navigate('/'); // Send them back to the home page
  };

  return (
    <nav className="bg-white shadow-soft sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          
          <div className="flex-shrink-0 flex items-center cursor-pointer" onClick={() => navigate('/')}>
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center mr-2">
              <span className="text-white font-bold text-xl">+</span>
            </div>
            <span className="font-extrabold text-xl text-textDark tracking-tight">
              Swasthya<span className="text-primary">Sathi</span>
            </span>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-textLight hover:text-primary font-medium transition-colors">Home</Link>
            <Link to="/ai-checker" className="text-textLight hover:text-primary font-medium transition-colors">AI Checker</Link>
            
            {isAuthenticated ? (
              <>
                <Link to="/dashboard" className="text-textLight hover:text-primary font-medium transition-colors">Dashboard</Link>
                <button 
                  onClick={handleLogout}
                  className="bg-red-50 text-red-600 hover:bg-red-100 px-4 py-2 rounded-lg font-medium transition-colors"
                >
                  Logout
                </button>
              </>
            ) : (
              <div className="flex space-x-4">
                <Link to="/login" className="text-primary font-semibold hover:text-primaryDark px-4 py-2 transition-colors">
                  Login
                </Link>
                <Link to="/register" className="bg-primary hover:bg-primaryDark text-white px-5 py-2 rounded-lg font-semibold transition-all shadow-sm">
                  Sign Up
                </Link>
              </div>
            )}
          </div>

        </div>
      </div>
    </nav>
  );
};

export default Navbar;