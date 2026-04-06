import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuthStore from '../store/authStore';

const Navbar = () => {
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Pull exactly what we need from Zustand
  const { isAuthenticated, logout, user } = useAuthStore(); 

  const handleLogout = () => {
    logout(); // Call the Zustand logout action
    setIsMobileMenuOpen(false);
    navigate('/'); // Send them back to the home page
  };

  // Helper to standardise clicking links in mobile view
  const handleMobileNav = (path) => {
    navigate(path);
    setIsMobileMenuOpen(false);
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

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-textLight hover:text-primary font-medium transition-colors">Home</Link>
            
            {user?.role === 'doctor' ? (
              <>
                <Link to="/doctor-dashboard" className="text-textLight hover:text-primary font-medium transition-colors">My Patients</Link>
                <Link to="/ai-checker" className="text-textLight hover:text-primary font-medium transition-colors">AI Checker</Link>
              </>
            ) : (
              <>
                <Link to="/doctors" className="text-textLight hover:text-primary font-medium transition-colors">Find Doctors</Link>
                <Link to="/ai-checker" className="text-textLight hover:text-primary font-medium transition-colors">AI Checker</Link>
                {isAuthenticated && (
                  <Link to="/dashboard" className="text-textLight hover:text-primary font-medium transition-colors">Dashboard</Link>
                )}
              </>
            )}

            {isAuthenticated ? (
              <button 
                onClick={handleLogout}
                className="bg-red-50 text-red-600 hover:bg-red-100 px-4 py-2 rounded-lg font-medium transition-colors"
              >
                Logout
              </button>
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
          
          {/* Mobile Menu Toggle Button */}
          <div className="md:hidden flex items-center">
             <button 
               onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
               className="text-textDark hover:text-primary transition-colors p-2"
             >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                   {isMobileMenuOpen 
                     ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                     : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                   }
                </svg>
             </button>
          </div>

        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 flex flex-col shadow-soft absolute w-full left-0 z-40">
          <div className="px-4 pt-2 pb-6 flex flex-col space-y-4">
             <button onClick={() => handleMobileNav('/')} className="text-left text-textDark font-medium py-2 border-b border-gray-50">Home</button>
             
             {user?.role === 'doctor' ? (
              <>
                <button onClick={() => handleMobileNav('/doctor-dashboard')} className="text-left text-textDark font-medium py-2 border-b border-gray-50">My Patients</button>
                <button onClick={() => handleMobileNav('/ai-checker')} className="text-left text-textDark font-medium py-2 border-b border-gray-50">AI Checker</button>
              </>
            ) : (
              <>
                <button onClick={() => handleMobileNav('/doctors')} className="text-left text-textDark font-medium py-2 border-b border-gray-50">Find Doctors</button>
                <button onClick={() => handleMobileNav('/ai-checker')} className="text-left text-textDark font-medium py-2 border-b border-gray-50">AI Checker</button>
                {isAuthenticated && (
                  <button onClick={() => handleMobileNav('/dashboard')} className="text-left text-textDark font-medium py-2 border-b border-gray-50">Dashboard</button>
                )}
              </>
            )}

            {isAuthenticated ? (
              <button 
                onClick={handleLogout}
                className="text-left font-bold text-red-600 py-2 mt-2"
              >
                Logout
              </button>
            ) : (
              <div className="flex flex-col space-y-3 mt-4">
                <button onClick={() => handleMobileNav('/login')} className="w-full text-center text-primary border border-primary/20 py-3 rounded-xl font-bold bg-blue-50">Login</button>
                <button onClick={() => handleMobileNav('/register')} className="w-full text-center bg-primary text-white py-3 rounded-xl font-bold">Sign Up</button>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};
export default Navbar;