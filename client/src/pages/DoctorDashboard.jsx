// src/pages/DoctorDashboard.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../lib/axios';
import useAuthStore from '../store/authStore';
import { toast } from 'react-toastify';

const DoctorDashboard = () => {
  const { user } = useAuthStore();
  const [appointments, setAppointments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchSchedule = async () => {
    try {
      const response = await api.get('/appointments');
      setAppointments(response.data.appointments || []);
    } catch (error) {
      console.error("Failed to fetch schedule:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSchedule();
  }, []);

  const handleMarkAttended = async (id) => {
    const notes = window.prompt("Enter prescription or consultation notes for the patient:");
    if (!notes) return; // User cancelled or entered nothing

    try {
      await api.put(`/appointments/${id}/notes`, { doctorNotes: notes });
      toast.success("Appointment marked as completed!");
      fetchSchedule(); // Refresh the list
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update appointment");
    }
  };

  return (
    <div className="min-h-screen bg-surface p-6 md:p-12">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="mb-10 bg-white p-8 rounded-3xl shadow-soft flex items-center justify-between border-l-8 border-primary">
          <div>
            <h1 className="text-3xl font-extrabold text-textDark mb-1">
              Welcome, {user?.name || 'Doctor'}
            </h1>
            <p className="text-textLight font-medium">Manage your consultations and patient care.</p>
          </div>
          <div className="hidden md:block bg-blue-50 text-primary px-6 py-3 rounded-xl font-bold">
            {new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}
          </div>
        </div>

        <h2 className="text-2xl font-bold text-textDark mb-6 flex items-center gap-2">
          📅 Today's Schedule
        </h2>

        {isLoading ? (
          <div className="flex justify-center p-12">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
          </div>
        ) : appointments.length === 0 ? (
          <div className="bg-white p-12 rounded-3xl shadow-soft text-center">
            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">☕</div>
            <h3 className="text-xl font-bold text-textDark mb-2">Your schedule is clear!</h3>
            <p className="text-textLight">You have no upcoming appointments booked right now.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {appointments.map((apt) => (
              <div key={apt._id} className="bg-white p-6 rounded-2xl shadow-soft border border-gray-100 relative overflow-hidden group">
                
                {/* Status Indicator */}
                <div className={`absolute top-0 left-0 w-1 h-full 
                  ${apt.status === 'confirmed' ? 'bg-green-500' : 'bg-yellow-500'}`}
                ></div>

                <div className="flex justify-between items-start mb-4 pl-2">
                  <div>
                    <h3 className="text-lg font-bold text-textDark">
                      {apt.patientId?.name || 'Unknown Patient'}
                    </h3>
                    <p className="text-sm text-textLight">Patient</p>
                  </div>
                  <div className="text-right bg-surface px-3 py-1 rounded-lg">
                    <p className="text-sm font-bold text-primary">{apt.timeSlot}</p>
                    <p className="text-xs text-textLight font-medium">{new Date(apt.date).toLocaleDateString()}</p>
                  </div>
                </div>

                <div className="pl-2 mb-6">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Reason for Visit</p>
                  <p className="text-sm text-textDark bg-gray-50 p-3 rounded-xl border border-gray-100">
                    {apt.reasonForVisit || 'No reason provided.'}
                  </p>
                </div>

                {/* Telehealth & Action Buttons */}
                {apt.status !== 'completed' ? (
                  <div className="flex flex-col gap-3 relative z-10">
                    <Link 
                      to={`/telehealth/${apt._id}`}
                      className="block w-full text-center bg-primary hover:bg-primaryDark text-white py-3 rounded-xl font-bold transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                    >
                      Start Video Consultation
                    </Link>
                    <button
                      onClick={() => handleMarkAttended(apt._id)}
                      className="block w-full text-center bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-700 py-3 rounded-xl font-bold transition-all shadow-sm transform hover:-translate-y-0.5"
                    >
                      Mark as Attended ✓
                    </button>
                  </div>
                ) : (
                  <div className="w-full text-center bg-gray-100 text-gray-500 py-3 rounded-xl font-bold border border-gray-200">
                    Completed
                  </div>
                )}

              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
};

export default DoctorDashboard;