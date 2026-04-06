// src/pages/Doctors.jsx
import React, { useState, useEffect } from 'react';
import api from '../lib/axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const Doctors = () => {
  const navigate = useNavigate();
  const [doctors, setDoctors] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Filtering states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('All');

  // --- NEW: Booking Modal States ---
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingData, setBookingData] = useState({
    date: '',
    timeSlot: '10:00 AM',
    reasonForVisit: ''
  });

  const specialties = ['All', 'Cardiologist', 'Dermatologist', 'General Physician', 'Neurologist', 'Pediatrician', 'Psychiatrist'];

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await api.get('/doctors');
        setDoctors(response.data.doctors || []);
      } catch (error) {
        console.error("Error fetching doctors:", error);
        // Fallback data just in case
        setDoctors([
          { _id: '65f1a2b3c4d5e6f7a8b9c0d1', name: 'Dr. Sarah Jenkins', specialization: 'Cardiologist', experience: 12, consultationFee: 500 },
          { _id: '65f1a2b3c4d5e6f7a8b9c0d2', name: 'Dr. Amit Patel', specialization: 'Dermatologist', experience: 8, consultationFee: 400 },
        ]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDoctors();
  }, []);

  const filteredDoctors = doctors.filter(doctor => {
    const matchesSearch = doctor.userId?.name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          doctor.specialty?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSpecialty = selectedSpecialty === 'All' || doctor.specialty === selectedSpecialty;
    return matchesSearch && matchesSpecialty;
  });

  // --- NEW: Handle Booking Submission ---
  const submitBooking = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Send the real appointment to your backend!
      await api.post('/appointments', {
        doctorId: selectedDoctor._id,
        date: bookingData.date,
        timeSlot: bookingData.timeSlot,
        reasonForVisit: bookingData.reasonForVisit,
        status: 'confirmed', // We are forcing this to 'confirmed' so you can test the video immediately!
        meetingLink: 'ready' // Just a dummy string so the frontend knows a link exists
      });

      toast.success(`Appointment confirmed with ${selectedDoctor.userId?.name}!`);
      setSelectedDoctor(null); // Close the modal
      navigate('/dashboard'); // Teleport to the dashboard!

    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to book appointment.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface p-6 md:p-12 relative">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-4xl font-extrabold text-textDark mb-4">
            Find a <span className="text-primary">Specialist</span>
          </h1>
          <p className="text-lg text-textLight">
            Book in-person or telehealth appointments with top-rated doctors.
          </p>
        </div>

        {/* Search and Filter Bar */}
        <div className="bg-white p-4 rounded-2xl shadow-soft mb-8 flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <input 
              type="text" 
              placeholder="Search by doctor name or specialty..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>
          <div className="md:w-64">
            <select 
              value={selectedSpecialty}
              onChange={(e) => setSelectedSpecialty(e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 bg-white"
            >
              {specialties.map(spec => (
                <option key={spec} value={spec}>{spec}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Doctor Grid */}
        {isLoading ? (
          <div className="flex justify-center p-12">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
          </div>
        ) : filteredDoctors.length === 0 ? (
          <div className="text-center p-12 bg-white rounded-2xl shadow-soft">
            <p className="text-textLight text-lg">No doctors found matching your criteria.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDoctors.map(doctor => (
              <div key={doctor._id} className="bg-white rounded-2xl shadow-soft overflow-hidden border border-gray-100 hover:border-primary/30 transition-all hover:-translate-y-1">
                <div className="p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center text-primary text-xl font-bold">
                      {doctor.userId?.name ? doctor.userId.name.charAt(0).toUpperCase() : 'D'}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-textDark">{doctor.userId?.name || 'Unknown Doctor'}</h3>
                      <p className="text-primary font-medium text-sm">{doctor.specialty || 'General'}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-2 mb-6 text-sm text-textLight">
                    <p className="flex justify-between">
                      <span>Experience:</span> 
                      <span className="font-semibold text-textDark">{doctor.experience || '5+'} Years</span>
                    </p>
                    <p className="flex justify-between">
                      <span>Fee:</span> 
                      <span className="font-semibold text-textDark">₹{doctor.consultationFee || '500'}</span>
                    </p>
                  </div>

                  {/* Clicking this now opens the Modal! */}
                  <button 
                    onClick={() => setSelectedDoctor(doctor)}
                    className="w-full bg-secondary hover:bg-emerald-600 text-white py-2.5 rounded-xl font-semibold transition-colors"
                  >
                    Book Appointment
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>

      {/* --- NEW: THE BOOKING MODAL --- */}
      {selectedDoctor && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl animate-fade-in-up">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-textDark">Book Consultation</h2>
              <button onClick={() => setSelectedDoctor(null)} className="text-gray-400 hover:text-red-500 font-bold text-xl">✕</button>
            </div>
            
            <p className="text-sm text-textLight mb-6">Scheduling with <span className="font-bold text-primary">{selectedDoctor.userId?.name}</span></p>

            <form onSubmit={submitBooking} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-textDark mb-1">Date</label>
                <input 
                  type="date" 
                  required 
                  value={bookingData.date}
                  onChange={(e) => setBookingData({...bookingData, date: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/50 outline-none" 
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-textDark mb-1">Time Slot</label>
                <select 
                  value={bookingData.timeSlot}
                  onChange={(e) => setBookingData({...bookingData, timeSlot: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/50 outline-none"
                >
                  <option>09:00 AM</option>
                  <option>10:30 AM</option>
                  <option>02:00 PM</option>
                  <option>04:00 PM</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-textDark mb-1">Reason for Visit</label>
                <textarea 
                  required
                  rows="3"
                  placeholder="E.g., Follow up, routine checkup, headache..."
                  value={bookingData.reasonForVisit}
                  onChange={(e) => setBookingData({...bookingData, reasonForVisit: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/50 outline-none resize-none"
                ></textarea>
              </div>

              <button 
                type="submit" 
                disabled={isSubmitting}
                className="w-full bg-primary hover:bg-primaryDark text-white py-3 rounded-xl font-bold transition-all mt-4 disabled:opacity-50"
              >
                {isSubmitting ? 'Confirming...' : 'Confirm Appointment'}
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default Doctors;