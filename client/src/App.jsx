import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Import Components & Pages
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import AiChecker from './pages/AiChecker';
import Doctors from './pages/Doctors';
import Telehealth from './pages/Telehealth';
import Register from './pages/Register';
import DoctorDashboard from './pages/DoctorDashboard';

const App = () => {
  return (
    <Router>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
      
  
      <Navbar /> 
      
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/ai-checker" element={<AiChecker />} />
        <Route path="/doctors" element={<Doctors />} />
        <Route path="/telehealth/:id" element={<Telehealth />} />
        <Route path="/register" element={<Register />} />
        <Route path="/doctor-dashboard" element={<DoctorDashboard />} />
      </Routes>
    </Router>
  );
};

export default App;