// src/store/authStore.js
import { create } from 'zustand';
import api from '../lib/axios';
import { toast } from 'react-toastify';

const getUserFromStorage = () => {
  try {
    const item = localStorage.getItem('user');
    return item && item !== 'undefined' ? JSON.parse(item) : null;
  } catch (_error) {
    return null;
  }
};

const useAuthStore = create((set) => ({
  user: getUserFromStorage(),
  token: localStorage.getItem('token') || null,
  isAuthenticated: !!localStorage.getItem('token'),
  isLoading: false,

  // The REAL Login Function
  loginUser: async (email, password) => {
    set({ isLoading: true });
    try {
      // Send the request to your Express server
      const response = await api.post('/auth/login', { email, password });
      
      const userData = response.data; // This contains { _id, name, email, role, token }
      
      localStorage.setItem('token', userData.token); 
      localStorage.setItem('user', JSON.stringify(userData)); 
      
      set({ 
        user: userData, 
        token: userData.token, 
        isAuthenticated: true, 
        isLoading: false 
      });

      toast.success('Welcome back to Swasthya Sathi!');
      return true; 

    } catch (error) {
      set({ isLoading: false });
      toast.error(error.response?.data?.message || 'Login failed. Please try again.');
      return false; 
    }
  },

  logout: () => {
    localStorage.removeItem('token'); 
    localStorage.removeItem('user'); 
    set({ user: null, token: null, isAuthenticated: false });
    toast.info('You have been logged out.');
  },
}));

export default useAuthStore;