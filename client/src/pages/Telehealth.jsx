// src/pages/Telehealth.jsx
import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import useAuthStore from '../store/authStore';

const Telehealth = () => {
  const { id } = useParams(); // This will grab the appointment ID from the URL
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const isDoctor = user?.role === 'doctor';
  
  // These "refs" allow React to connect directly to the HTML <video> tags
  const localVideoRef = useRef(null);
  const [stream, setStream] = useState(null);
  
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);

  useEffect(() => {
    //Ask the browser for camera and microphone access
    const startVideo = async () => {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({ 
          video: true, 
          audio: true 
        });
        
        setStream(mediaStream);
        
        //Attach the camera feed to our video element on the screen
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = mediaStream;
        }
        
        toast.success("Camera and microphone connected!");
      } catch (error) {
        console.error("Error accessing media devices:", error);
        toast.error("Please allow camera and microphone access to join the call.");
      }
    };

    startVideo();

    //Cleanup function: Turn off the camera when the user leaves the page!
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  // --- Controls ---
  const toggleMute = () => {
    if (stream) {
      const audioTrack = stream.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setIsMuted(!audioTrack.enabled);
      }
    }
  };

  const toggleVideo = () => {
    if (stream) {
      const videoTrack = stream.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        setIsVideoOff(!videoTrack.enabled);
      }
    }
  };

  const endCall = () => {
    // Turn off camera
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }
    toast.info("Call ended.");
    navigate('/dashboard'); // Send them back to the dashboard
  };

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col">
      
      {/* Top Bar */}
      <div className="bg-gray-800 text-white p-4 flex justify-between items-center shadow-md z-10">
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
          <h2 className="font-semibold tracking-wide">Live Consultation Room</h2>
        </div>
        <span className="bg-gray-700 px-3 py-1 rounded-lg text-sm text-gray-300 font-mono">
          Apt ID: {id || 'Test-Room'}
        </span>
      </div>

      {/* Video Grid Area */}
      <div className="flex-1 p-4 flex justify-center items-center relative overflow-hidden">
        
        {/* Remote Video (Mocked for now) */}
        <div className="w-full max-w-5xl aspect-video bg-gray-800 rounded-2xl border border-gray-700 overflow-hidden relative flex items-center justify-center shadow-2xl">
          <div className="text-center">
            <div className="w-24 h-24 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4 border-4 border-gray-600">
              <span className="text-gray-400 text-4xl font-bold">{isDoctor ? 'Pt' : 'Dr'}</span>
            </div>
            <p className="text-gray-400 font-medium">
              {isDoctor ? 'Waiting for patient to join...' : 'Waiting for doctor to join...'}
            </p>
          </div>


          <div className="absolute bottom-6 right-6 w-48 md:w-64 aspect-video bg-black rounded-xl overflow-hidden border-2 border-gray-600 shadow-lg z-20 transition-transform hover:scale-105">
            {isVideoOff ? (
              <div className="w-full h-full flex items-center justify-center bg-gray-800">
                <span className="text-gray-400 text-sm">Camera Off</span>
              </div>
            ) : (
              <video 
                ref={localVideoRef} 
                autoPlay 
                playsInline 
                muted // Always mute local video so you don't hear your own echo!
                className="w-full h-full object-cover transform scale-x-[-1]" // scale-x-[-1] mirrors the camera so it acts like a mirror
              />
            )}
          </div>
        </div>

      </div>

      {/* Bottom Control Bar */}
      <div className="bg-gray-800 p-6 flex justify-center items-center gap-6 z-10 pb-10">
        
        {/* Mute Button */}
        <button 
          onClick={toggleMute}
          className={`w-14 h-14 rounded-full flex items-center justify-center transition-all shadow-lg
            ${isMuted ? 'bg-red-500 hover:bg-red-600' : 'bg-gray-600 hover:bg-gray-500'}`}
        >
          <span className="text-white font-bold text-xs">{isMuted ? 'Unmute' : 'Mute'}</span>
        </button>

        {/* End Call Button */}
        <button 
          onClick={endCall}
          className="bg-red-600 hover:bg-red-700 w-16 h-16 rounded-full flex items-center justify-center shadow-xl transform transition hover:scale-105"
        >
          <span className="text-white font-extrabold text-sm">END</span>
        </button>

        {/* Video Button */}
        <button 
          onClick={toggleVideo}
          className={`w-14 h-14 rounded-full flex items-center justify-center transition-all shadow-lg
            ${isVideoOff ? 'bg-red-500 hover:bg-red-600' : 'bg-gray-600 hover:bg-gray-500'}`}
        >
           <span className="text-white font-bold text-xs">{isVideoOff ? 'Video On' : 'Video Off'}</span>
        </button>

      </div>

    </div>
  );
};

export default Telehealth;