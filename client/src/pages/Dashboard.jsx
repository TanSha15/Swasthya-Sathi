// src/pages/Dashboard.jsx
import React, { useState, useEffect } from "react";
import api from "../lib/axios";
import useAuthStore from "../store/authStore";
import { Link, useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const { user, isAuthenticated } = useAuthStore();
  const navigate = useNavigate();

  const [appointments, setAppointments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) return navigate('/login');
    if (user?.role === 'doctor') return navigate('/doctor-dashboard');
    // Function to fetch data from your Express backend
    const fetchAppointments = async () => {
      try {
        const response = await api.get("/appointments");
        setAppointments(response.data.appointments || []);
      } catch (error) {
        console.error("Failed to fetch appointments:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  const handleCancel = async (id) => {
    if (!window.confirm("Are you sure you want to cancel this appointment?")) return;
    try {
      await api.put(`/appointments/${id}/status`, { status: 'cancelled' });
      const response = await api.get("/appointments"); // Refresh
      setAppointments(response.data.appointments || []);
    } catch (error) {
      console.error("Failed to cancel appointments:", error);
    }
  };

  return (
    <div className="min-h-screen bg-surface p-8">
      <div className="max-w-7xl mx-auto">
        {/* Welcome Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-textDark">
            Welcome, {user?.name || "Patient"}
          </h1>
          <p className="text-textLight mt-1">
            Here is an overview of your health schedule.
          </p>
        </div>

        {/* Appointments Section */}
        <h2 className="text-xl font-bold text-textDark mb-4">
          Upcoming Appointments
        </h2>

        {isLoading ? (
          <div className="flex justify-center p-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : appointments.length === 0 ? (
          <div className="bg-white p-8 rounded-2xl shadow-soft text-center">
            <p className="text-textLight mb-4">
              You have no upcoming appointments.
            </p>
            <Link to="/doctors" className="inline-block bg-primary hover:bg-primaryDark text-white px-6 py-2 rounded-lg font-medium transition-colors">
              Book a Consultation
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {appointments.map((apt) => (
              <div
                key={apt._id}
                className="bg-white p-6 rounded-2xl shadow-soft border border-gray-100 hover:border-primary/20 transition-colors"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <span
                      className={`text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider
                      ${
                        apt.status === "confirmed"
                          ? "bg-green-100 text-green-700"
                          : apt.status === "completed"
                            ? "bg-gray-100 text-gray-700"
                            : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {apt.status}
                    </span>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-primary">
                      {new Date(apt.date).toLocaleDateString()}
                    </p>
                    <p className="text-xs text-textLight">{apt.timeSlot}</p>
                  </div>
                </div>

                <h3 className="font-bold text-textDark mb-1">
                  Dr. {apt.doctorId?.userId?.name || "Unknown Doctor"}
                </h3>
                <p className="text-sm text-textLight mb-4 line-clamp-2">
                  Reason: {apt.reasonForVisit}
                </p>

                {/* Action Buttons */}
                {apt.status === 'confirmed' && (
                  <div className="flex gap-2 mb-2">
                    {apt.meetingLink && (
                      <Link
                        to={`/telehealth/${apt._id}`}
                        className="flex-1 text-center bg-secondary hover:bg-emerald-600 text-white py-2 rounded-lg font-medium transition-colors"
                      >
                        Join Call
                      </Link>
                    )}
                    <button
                      onClick={() => handleCancel(apt._id)}
                      className="flex-1 text-center bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 py-2 rounded-lg font-medium transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                )}

                {/* Doctor Notes - Only shows if notes exist */}
                {apt.doctorNotes && (
                  <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-100">
                    <p className="text-xs font-semibold text-primary mb-1">
                      Doctor's Prescription:
                    </p>
                    <p className="text-sm text-textDark">{apt.doctorNotes}</p>
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

export default Dashboard;
