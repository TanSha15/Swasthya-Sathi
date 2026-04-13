import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
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
    <div className="min-h-screen bg-surface flex font-sans">
      {/* Left Visual Pane */}
      <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-primary to-primaryDark p-12 flex-col justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-white/5 backdrop-blur-3xl"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-secondary/30 blur-[100px] pointer-events-none"></div>
        <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-blue-400/20 blur-[100px] pointer-events-none"></div>
        
        <div className="relative z-10 flex flex-col items-center text-center">
          <div className="flex items-center gap-3 mb-12">
            <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center text-primary shadow-2xl font-black text-3xl">
              S
            </div>
            <span className="text-3xl font-extrabold text-white tracking-tight">Swasthya-Sathi</span>
          </div>
          <h1 className="text-5xl lg:text-6xl font-extrabold text-white mb-6 leading-[1.1] tracking-tight">Welcome back to <br/>better healthcare.</h1>
          <p className="text-white/90 text-xl leading-relaxed max-w-md mt-6">Securely access your patient portal, continue your ongoing treatments, and consult with specialists effortlessly.</p>
        </div>
      </div>

      {/* Right Form Pane */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12 relative">
        <Link to="/" className="absolute top-8 right-8 text-sm font-semibold text-textLight hover:text-primary transition-colors">← Back to Home</Link>
        <div className="w-full max-w-md animate-fade-in-up">
          <div className="mb-10 text-center lg:text-left">
             <h2 className="text-4xl font-extrabold text-textDark mb-3">Sign in</h2>
             <p className="text-textLight text-lg">Enter your details to access your account.</p>
          </div>
          
          <form onSubmit={handleRealLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-textDark mb-2">Email Address</label>
              <input 
                type="email" 
                required 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-5 py-4 bg-white border border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all text-textDark shadow-sm" 
                placeholder="name@example.com" 
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-textDark mb-2">Password</label>
              <input 
                type="password" 
                required 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-5 py-4 bg-white border border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all text-textDark shadow-sm" 
                placeholder="••••••••" 
              />
            </div>
            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full bg-primary hover:bg-primaryDark text-white py-4 rounded-2xl font-bold text-lg transition-all shadow-lg hover:shadow-primary/30 hover:-translate-y-1 disabled:opacity-50 disabled:transform-none mt-2"
            >
              {isLoading ? 'Authenticating...' : 'Sign In securely'}
            </button>
          </form>

          <p className="text-center text-textLight mt-8">
             Don't have an account? <Link to="/register" className="text-primary font-bold hover:underline">Register now</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;