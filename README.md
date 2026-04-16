# Swasthya Sathi

**Live Project Link:** [https://swasthya-sathi-nt7g.onrender.com/](https://swasthya-sathi-nt7g.onrender.com/)

## 1. Project Overview

**Swasthya Sathi** is a comprehensive, full-stack telehealth platform designed to bridge the gap between patients and healthcare providers. It provides accessible, remote healthcare services by allowing patients to utilize an intelligent, AI-driven symptom checker, find appropriate medical specialists based on their condition, schedule consultations, and conduct live peer-to-peer video calls. The platform is architected to securely and efficiently emulate the workflow of a traditional walk-in clinic entirely within a web environment.

## 2. Core System Features

### 2.1. Role-Based Access Control (RBAC)
The application enforces strict separation of concerns through role-based routing and authorization.
- **Patient Dashboard:** Grants access to the AI symptom checker, appointment scheduling, and personal consultation history.
- **Doctor Dashboard:** Affords registered medical professionals access to their appointment queue, patient medical notes, and consultation management tools.

### 2.2. AI-Powered Symptom Analysis
Swasthya Sathi integrates a sophisticated, AI-driven diagnostic assistant utilizing Google Gemini. 
- **Intelligent Triage:** Analyzes user-inputted symptoms, age, gender, and condition duration.
- **Specialty Recommendation:** Actively recommends the correct medical specialty based on the preliminary assessment, streamlining the specialist discovery process.
- **Safety Guardrails:** Enforces strict systemic guardrails to identify urgent/life-threatening emergencies and advises immediate physical medical attention rather than purely remote consultation.

### 2.3. Native WebRTC Telehealth Integration
The platform offers a robust virtual consultation environment.
- **Peer-to-Peer Communication:** Utilizes raw WebRTC for direct device-to-device audio and video streaming, ensuring minimal latency and high fidelity.
- **Signaling Server:** Leverages a custom Socket.io-based signaling mechanism to exchange cryptographic RTCPeerConnection offers, answers, and ICE candidates to systematically navigate firewalls and NATs.

### 2.4. Appointment Lifecycle Management
An end-to-end booking mechanism connecting patients with the appropriate healthcare providers.
- **Scheduling System:** Patients can review doctor availability and book specific time slots.
- **Consultation Lifecycle:** Doctors can review preliminary symptom reports prior to the call, confirm the appointment, and document prescription notes upon completion.

## 3. Technology Stack and Architecture

The platform operates on a modernized MERN-stack variant (MongoDB, Express.js, React, Node.js), utilizing the following core technologies:

### 3.1. Client-Side (Frontend)
- **Framework:** React (Bootstrapped via Vite)
- **Styling:** Tailwind CSS for responsive, utility-first design
- **State Management:** Zustand for lightweight, global state management (Authentication and Role persistence)
- **Networking:** Axios (with optimized JWT interceptors) and Socket.io-client
- **Routing:** React Router DOM

### 3.2. Server-Side (Backend)
- **Runtime & Framework:** Node.js with Express.js
- **Database:** MongoDB integrated via Mongoose ODM
- **Authentication:** JSON Web Tokens (JWT) and bcryptjs for secure password hashing
- **Real-Time Engine:** Socket.io for WebRTC signaling protocols
- **AI Integration:** Google GenAI SDK (`@google/genai`)
- **Storage:** Cloudinary instances interfaced via Multer for secure credential/document uploads

## 4. Directory Structure

```text
swasthya-sathi/
├── client/                     # Frontend Application
│   ├── public/                 # Static assets
│   ├── src/                    
│   │   ├── components/         # Reusable presentation and layout components
│   │   ├── lib/                # Configuration and utilities (e.g., Axios setup)
│   │   ├── pages/              # Primary route views (Dashboard, Telehealth, etc.)
│   │   ├── store/              # Global state management configuration
│   │   ├── App.jsx             # Top-level component and routing matrix
│   │   └── main.jsx            # React injection point
│   └── vite.config.js          # Build tool configuration
│
└── server/                     # Backend REST API and WebSockets
    ├── config/                 # Service initialization (Database, Gemini, Cloudinary)
    ├── controllers/            # Route business logic and request handlers
    ├── middleware/             # Request interception (Authentication, Authorization, File Uploads)
    ├── models/                 # Database schema definitions
    ├── routes/                 # API endpoint mappings
    ├── socket/                 # Dedicated WebRTC signaling handlers
    └── server.js               # Application entry point and server binding
```

## 5. Local Setup and Installation

### 5.1. Prerequisites
Ensure the following tools are installed on your local development environment:
- **Node.js** (v18.x or higher)
- **NPM** or **Yarn**
- **MongoDB** (Local instance or remote cluster URI)

### 5.2. Repository Cloning
```bash
git clone https://github.com/yourusername/swasthya-sathi.git
cd swasthya-sathi
```

### 5.3. Environment Variables Configuration

The application requires specific environment variables for successful execution. Ensure you create a `.env` file within both the `server` and `client` directories.

**Backend (`server/.env`)**
```env
PORT=5000
NODE_ENV=development
MONGO_URI=<Your Complete MongoDB Connection URI>
JWT_SECRET=<A secure cryptographic string for token signing>
GEMINI_API_KEY=<Your Google AI Studio API Key>
CLOUDINARY_URL=<Your Cloudinary Connection URL>
```

**Frontend (`client/.env`)**
```env
VITE_API_URL=http://localhost:5000
```

### 5.4. Installing Dependencies and Running

The project requires both the client and server applications to run concurrently.

**Starting the Backend Server**
```bash
cd server
npm install
npm run dev
```

**Starting the Frontend Client**
Open a separate terminal instance:
```bash
cd client
npm install
npm run dev
```

The application will be accessible via a web browser at `http://localhost:5173`. The backend API processes requests on `http://localhost:5000`.

## 6. Project Workflows

### Patient Workflow
1. **Registration:** Create an account specifying the "Patient" role.
2. **AI Triage:** Navigate to the AI Checker, input symptoms, and receive a preliminary assessment and specialty recommendation.
3. **Booking:** Browse available doctors within the recommended specialty and submit a consultation request.
4. **Consultation:** Enter the provided Telehealth room at the scheduled time to initiate a secure video session with the physician.

### Doctor Workflow
1. **Registration:** Create an account specifying the "Doctor" role and upload necessary credentials.
2. **Queue Management:** Review incoming patient appointment requests, along with their preliminary symptom reports, and accept them.
3. **Consultation:** Join the Telehealth room utilizing a dedicated session ID to conduct the appointment.
4. **Documentation:** Following the call, mark the consultation as completed and document relevant medical notes or prescriptions.

## 7. License
This codebase is distributed under the [ISC](LICENSE) License.
