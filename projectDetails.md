# Swasthya Sathi - Project Details Documentation

## 1. Project Objective and Purpose
**Swasthya Sathi** (meaning "Health Companion" in Hindi/Bengali/Sanskrit) is a comprehensive, full-stack telehealth platform built to bridge the gap between patients and healthcare providers. 

The core objective is to provide accessible, remote healthcare services by allowing patients to safely check their symptoms utilizing an intelligent guard-railed AI agent, find appropriate medical specialists based on their requirements, schedule consultations seamlessly, and conduct live peer-to-peer video calls. The platform is designed to emulate the complete workflow of a traditional walk-in clinic entirely via the web.

## 2. Key Features
- **Role-Based Access Control**: Separate, secure workflows and dashboards for general Patients and registered Doctors.
- **AI Symptom Checker**: A compassionate AI assistant powered by Google Gemini (Flash 2.5) that analyzes user symptoms, calculates urgency metrics, suggests a preliminary (non-diagnostic) assessment, and actively recommends the correct medical specialty to consult.
- **Real-Time Video Consultations (Telehealth)**: Integrated WebRTC peer-to-peer video calling for remote consultation, backed by a fast Socket.io signaling server.
- **Appointment Lifecycle Management**: Patients can view available doctors and book time slots. Doctors can review issues, confirm, complete, and add prescription notes to appointments.
- **Doctor Profiles & Credential Verification**: Doctors can upload their professional bio and licensing documents (backed securely by Cloudinary).
- **Centralized State Management**: Seamless navigation and persistent state through Zustand's `authStore`.

## 3. Technology Stack
- **Frontend**: React, Vite, Tailwind CSS, Zustand, Socket.io-client, React Router DOM, Axios.
- **Backend**: Node.js, Express.js, MongoDB + Mongoose, Socket.io, Google GenAI SDK (`@google/genai`).
- **Cloud/External Services**: Render (Hosting/PaaS), Cloudinary (File/Image Storage), Google Gemini (AI Engine).

## 4. System Architecture & Data Flow

### Authentication Flow
1. User submits login/registration credentials via the `/api/auth` proxy route to the Express Server (handled by `authController`).
2. Server validates credentials against the MongoDB database (passwords safely hashed via bcrypt).
3. Server issues a securely-signed JSON Web Token (JWT), which is returned to the client browser and stored.
4. Zustand's `authStore` initializes the `isAuthenticated` state and role across all navigating components.

### AI Symptom Checker Flow
1. Patient inputs symptoms, age/gender demographics, and duration into the `AiChecker.jsx` interface.
2. The Request triggers an Axios call to the backend `/api/ai/analyze` route.
3. The `aiController` constructs a dense system prompt—strictly enforcing medical safety guardrails (e.g. identifying life-threatening emergencies)—and sends it to the Gemini API.
4. Gemini's response is parsed, validated as strict JSON, returned to the user, and simultaneously archived into the user's `AIAssessment` history database.
5. The frontend displays the urgency levels creatively and highlights the recommended specialty.

### Telehealth / WebRTC Video Flow
1. Doctor confirms an appointment -> Both users navigate to the `/telehealth/:roomId` route.
2. **Signaling Phase**: Both users connect to the Express Socket.io server. The patient and doctor join the exact same internal socket room.
3. **Offer/Answer Phase**: The Patient's connection creates a cryptographic RTCPeerConnection "Offer" capturing audio/video configurations. This is routed via Socket.io to the Doctor. The Doctor receives the Offer and replies with an "Answer".
4. **ICE Candidates**: Both browsers collect network metadata (using Google's public STUN servers) and exchange ICE candidates to systematically punch through firewalls and NATs.
5. **Streaming Phase**: A direct Peer-to-Peer media pipeline is established. Video and audio flow directly device-to-device with significantly lowered latency.

## 5. Directory & File Structure

```text
swasthya-sathi/
├── client/                     # Frontend Application (Vite + React)
│   ├── public/                 # Static assets
│   ├── src/                    
│   │   ├── components/         # Reusable UI elements (Navbar, Buttons, etc.)
│   │   ├── lib/              
│   │   │   └── axios.js        # Global HTTP Client configured with JWT Interceptors
│   │   ├── pages/              # Master Pages (Dashboard, Telehealth, Doctors, etc.)
│   │   ├── store/              # Zustand global state (authStore.js)
│   │   ├── App.jsx             # React Router configuration matrix
│   │   ├── index.css           # Tailwind configurations
│   │   └── main.jsx            # Application injection root
│   └── vite.config.js          
│
└── server/                     # Backend API (Node + Express)
    ├── config/                 
    │   ├── cloudinary.js       # Vendor image storage configurations
    │   ├── db.js               # MongoDB connection logic
    │   └── gemini.js           # Google GenAI initialization
    ├── controllers/            
    │   ├── aiController.js     # Orchestrates Gemini Prompts
    │   ├── appointmentController.js # Manages booking statuses
    │   ├── authController.js   # JWT authentication issuance
    │   └── doctorController.js # Aggregates doctor registries
    ├── middleware/             
    │   ├── authMiddleware.js   # Protects routes by enforcing Bearer tokens
    │   ├── roleMiddleware.js   # Restricts 'doctor' vs 'patient' logic
    │   └── uploadMiddleware.js # Handles Multer multipart forms
    ├── models/                 # Database Schemas (Mongoose)
    │   ├── AIAssessment.js
    │   ├── Appointment.js
    │   ├── DoctorProfile.js
    │   └── User.js
    ├── routes/                 # Express Router Endpoints
    ├── socket/                 
    │   └── videoHandler.js     # Standalone Websocket/STUN routing
    └── server.js               # Core Entrypoint (DB, Express App, HTTP Server, Render Pings)
```

## 6. Environment Variable Configuration

For the application to function correctly, ensure the following keys are populated in your deployment platforms or local `.env` files.

### Server (Backend) Environment Variables
| Variable | Description |
|---|---|
| `PORT` | Listening binding for Express (default: 5000). |
| `NODE_ENV` | Toggle between `development` and `production`. |
| `MONGO_URI` | Full connection URI to the MongoDB cluster. |
| `JWT_SECRET` | Used to cryptographically sign session tokens (Must be highly secure). |
| `GEMINI_API_KEY` | Key from Google AI Studio utilized by the Symptom Checker. |
| `CLOUDINARY_URL` | Connecting API environment variable mapped to Cloudinary. |
| `RENDER_EXTERNAL_URL`| *(Optional)* Automatically provided by Render servers. Triggers the internal Keep-Alive ping. |

### Client (Frontend) Environment Variables
| Variable | Description |
|---|---|
| `VITE_API_URL` | The absolute URL of the hosted backend server *(e.g., `https://swasthya-sathi-backend.onrender.com`)*. Read by Axios and Socket.io. Falls back to localhost in dev environments. |
