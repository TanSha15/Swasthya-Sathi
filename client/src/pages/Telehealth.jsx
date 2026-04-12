// src/pages/Telehealth.jsx
import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { io } from 'socket.io-client';
import useAuthStore from '../store/authStore';

const SERVER_URL = 'http://localhost:5000'; 

const Telehealth = () => {
  const { id: roomId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const isDoctor = user?.role === 'doctor';

  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  
  const peerConnectionRef = useRef(null);
  const socketRef = useRef(null);
  const localStreamRef = useRef(null);

  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [remoteConnected, setRemoteConnected] = useState(false);

  useEffect(() => {
    // 1. Initialize Socket
    socketRef.current = io(SERVER_URL, {
        transports: ['websocket', 'polling']
    });
    const socket = socketRef.current;

    // 2. Setup WebRTC Configuration (Google STUN)
    const configuration = {
      iceServers: [
        { urls: 'stun:stun.l.google.com:19302' },
        { urls: 'stun:stun1.l.google.com:19302' }
      ]
    };

    const createPeerConnection = () => {
      const pc = new RTCPeerConnection(configuration);

      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach(track => {
          pc.addTrack(track, localStreamRef.current);
        });
      }

      pc.ontrack = (event) => {
        if (remoteVideoRef.current) {
          remoteVideoRef.current.srcObject = event.streams[0];
          setRemoteConnected(true);
        }
      };

      pc.onicecandidate = (event) => {
        if (event.candidate) {
          socket.emit('ice-candidate', event.candidate);
        }
      };

      return pc;
    };

    const startMedia = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        localStreamRef.current = stream;
        
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }

        socket.emit('join-room', roomId, user?._id || 'guest');
      } catch (err) {
        console.error(err);
        toast.error("Camera/Microphone access denied.");
      }
    };

    startMedia();

    // 4. Socket Signaling Listeners
    socket.on('user-connected', async (userId) => {
      console.log('User connected, creating offer...');
      peerConnectionRef.current = createPeerConnection();
      const pc = peerConnectionRef.current;

      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);
      socket.emit('offer', offer);
    });

    socket.on('offer', async (offer) => {
      console.log('Received offer, answering...');
      peerConnectionRef.current = createPeerConnection();
      const pc = peerConnectionRef.current;

      await pc.setRemoteDescription(new RTCSessionDescription(offer));
      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);
      socket.emit('answer', answer);
    });

    socket.on('answer', async (answer) => {
      console.log('Received answer...');
      const pc = peerConnectionRef.current;
      if (pc && pc.signalingState !== 'stable') {
         await pc.setRemoteDescription(new RTCSessionDescription(answer));
      }
    });

    socket.on('ice-candidate', async (candidate) => {
      const pc = peerConnectionRef.current;
      if (pc) {
         try {
             await pc.addIceCandidate(new RTCIceCandidate(candidate));
         } catch(e) { console.error("Error adding Ice Candidate", e); }
      }
    });

    socket.on('user-disconnected', () => {
       toast.info("Remote peer disconnected.");
       setRemoteConnected(false);
       if (remoteVideoRef.current) remoteVideoRef.current.srcObject = null;
       if (peerConnectionRef.current) {
          peerConnectionRef.current.close();
          peerConnectionRef.current = null;
       }
    });

    return () => {
      if (localStreamRef.current) {
         localStreamRef.current.getTracks().forEach(track => track.stop());
      }
      if (peerConnectionRef.current) {
         peerConnectionRef.current.close();
      }
      if (socket) {
         socket.disconnect();
      }
    };
  }, [roomId, user?._id]);

  const toggleMute = () => {
    if (localStreamRef.current) {
      const audioTrack = localStreamRef.current.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setIsMuted(!audioTrack.enabled);
      }
    }
  };

  const toggleVideo = () => {
    if (localStreamRef.current) {
      const videoTrack = localStreamRef.current.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        setIsVideoOff(!videoTrack.enabled);
      }
    }
  };

  const endCall = () => {
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach(track => track.stop());
    }
    toast.info("Call ended.");
    if (isDoctor) {
      navigate('/doctor-dashboard');
    } else {
      navigate('/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col">
      {/* Top Bar */}
      <div className="bg-gray-800 text-white p-4 flex justify-between items-center shadow-md z-10 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
          <h2 className="font-semibold tracking-wide hidden sm:block">Live Consultation Room</h2>
          <span className="bg-gray-700 px-3 py-1 rounded-lg text-xs text-gray-300 font-mono">
           {remoteConnected ? 'Peer-to-Peer SECURE' : 'Waiting for connection...'}
          </span>
        </div>
        <span className="text-gray-400 font-mono text-xs">Room: {roomId}</span>
      </div>

      {/* Video Grid Area */}
      <div className="flex-1 p-4 flex justify-center items-center relative overflow-hidden">
        {/* Remote Video Container */}
        <div className="w-full max-w-5xl aspect-video bg-gray-800 rounded-2xl border border-gray-700 overflow-hidden relative flex items-center justify-center shadow-2xl">
          
          <video 
            ref={remoteVideoRef} 
            autoPlay 
            playsInline 
            className={`w-full h-full object-cover ${!remoteConnected && 'hidden'}`}
          />

          {!remoteConnected && (
             <div className="text-center">
               <div className="w-24 h-24 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4 border-4 border-gray-600">
                 <span className="text-gray-400 text-4xl font-bold">{isDoctor ? 'Pt' : 'Dr'}</span>
               </div>
               <p className="text-gray-400 font-medium animate-pulse">
                 {isDoctor ? 'Waiting for patient to join...' : 'Waiting for doctor to join...'}
               </p>
             </div>
          )}

          {/* Local PIP Video */}
          <div className="absolute bottom-6 right-6 w-48 md:w-64 aspect-video bg-black rounded-xl overflow-hidden border-2 border-gray-600 shadow-lg z-20">
            {isVideoOff ? (
              <div className="w-full h-full flex items-center justify-center bg-gray-800">
                <span className="text-gray-400 text-sm">Camera Off</span>
              </div>
            ) : (
              <video 
                ref={localVideoRef} 
                autoPlay 
                playsInline 
                muted
                className="w-full h-full object-cover transform scale-x-[-1]" 
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