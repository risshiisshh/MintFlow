# MintFlow 🌊

**A seamless Web3 onboarding prototype for gasless NFT credential minting.**

---

## 🛑 Problem Statement
Web3 onboarding is hindered by friction: new users must install wallets, secure seed phrases, acquire native tokens (ETH/MATIC) to pay for gas, and then execute transactions. This multi-step process creates a significant drop-off before users can experience an application.

## 💡 Solution
MintFlow demonstrates a streamlined onboarding flow where users can authenticate with familiar methods (like email or anonymous login) and instantly claim a digital badge or certificate. By abstracting wallet creation and simulating gas sponsorship, users experience blockchain interactions without the overhead of native token gas fees.

---

## 🧠 What We Achieved in This Hackathon
* **Real Working Backend + Frontend Integration:** Established a full-stack communication layer between React/Vite and a Node/Express server.
* **Functional Firebase Authentication:** Implemented a working auth system utilizing Firebase for random/email logins.
* **Smart Wallet Generation Pipeline:** Built the backend logic that ties authenticated user sessions to deterministically generated smart account addresses.
* **Gasless UX Simulation:** Created a frontend experience that successfully abstracts the complexity of blockchain interactions for onboarding.

---

## ⚙️ System Overview (Real Flow)
The current implementation follows a clear sequence from the client to our custom backend:

1. **Authentication:** The user logs in via the Frontend (React) using Firebase Auth (email/password or anonymous demo login).
2. **Session Verification:** The Frontend sends a secure request to the Backend API (`/api/auth/session`).
3. **Wallet Provisioning:** The Backend verifies the token and generates a Smart Account address mapped to the user's UID in Firestore.
4. **Transaction Request:** When the user initiates a mint, the request is sent to the Backend wallet API (`/api/mint` or `/api/wallet`).
5. **Execution / Simulation:** The backend orchestrates the transaction. Currently, this process simulates the gasless payload submission to demonstrate the user experience without requiring live Paymaster infrastructure.

---

## ✨ Features & Current Implementation Status

### ✅ Implemented
- **Firebase Auth:** Functional random email / anonymous login system.
- **Backend Wallet API:** Functioning endpoints for authentication and mint requests.
- **Smart Account Generation:** Backend logic successfully generates and maps wallets securely.
- **Frontend AuthContext Flow:** Robust React state management handling user sessions and UI updates.
- **Base Network Integration:** Partial integration for testnet deployments.

### 🧪 Mock / Simulation
- **Gasless Transactions:** The transaction lifecycle (including Paymaster gas abstraction logic) is conceptually integrated but relies on a robust mock/fallback mode to ensure a flawless demo experience.
- **Transaction Lifecycle UI states:** Frontend properly reflects simulated processing, success, and error states.

### 🚧 Planned (Future Scope)
- **Full ERC-4337 Production Deployment:** Transitioning from mock payloads to real bundler submissions.
- **Production Paymaster Infrastructure:** Replacing simulated gas sponsorships with live API keys.
- **Redis/BullMQ Worker System:** For asynchronous transaction processing and queuing.
- **SIWE Login (Sign-In with Ethereum):** For native Web3 user onboarding.

---

## 🔐 Authentication Flow
Authentication is handled entirely via Firebase to remove the need for browser extension wallets:
1. User clicks "Start Minting".
2. Firebase processes an anonymous/random login for a frictionless demo.
3. The frontend `AuthContext` captures the credentials.
4. The backend securely maps this Firebase UID to a generated blockchain address.

## 👛 Wallet & Backend Flow
Instead of relying on the client to manage private keys:
1. The Node.js Express backend securely generates a deterministic smart account upon login.
2. The public address is returned to the frontend.
3. When minting, the backend receives the intent and constructs the payload. 
*(Note: To guarantee uptime during the hackathon, the final payload submission is mocked if live Paymaster keys are absent).*

---

## 💻 Tech Stack
* **Frontend:** React 19, Vite, Tailwind CSS, React Router v7
* **Backend:** Node.js, Express, TypeScript, Firebase Admin SDK
* **Blockchain (Target):** Base Sepolia, Polygon Amoy
* **Database:** Firebase Firestore

---

## 📡 API Overview
| Endpoint | Method | Description |
|---|---|---|
| `/api/auth/session` | `POST` | Validates Firebase token & initiates smart wallet generation. |
| `/api/mint` | `POST` | Dispatches the request for NFT credential minting (Currently simulated). |
| `/api/wallet` | `GET/POST` | Manages backend wallet operations and mappings. |

---

## 📁 Folder Structure
```text
MintFlow/
├── backend/                # Node.js Express server
│   ├── src/                # Backend routes, controllers, and services
│   ├── .env                # Backend environment configuration
│   └── package.json
├── public/                 # Static assets
├── src/                    # React frontend source code
│   ├── components/         # Reusable UI elements
│   ├── pages/              # Application views (Landing, Minting)
│   └── main.tsx            # Application entry point
├── .env                    # Frontend environment configuration
└── package.json            # Frontend dependencies
```

---

## 🚀 Setup Instructions

### 1. Frontend Setup
```bash
git clone <your-repo-url>
cd MintFlow
npm install
npm run dev
```
*Runs locally on `http://localhost:5173`.*

### 2. Backend Setup
```bash
cd MintFlow/backend
npm install
npm run dev
```
*Runs locally on `http://localhost:8080`.*

---

## ⚙️ Environment Variables

### Frontend (`/.env`)
```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id
VITE_API_URL=http://localhost:8080
```

### Backend (`/backend/.env`)
```env
PORT=8080
NODE_ENV=development

# Firebase Admin SDK
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_CLIENT_EMAIL=your_client_email
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"

# Blockchain Targets
BASE_RPC_URL=https://sepolia.base.org
POLYGON_RPC_URL=https://rpc-amoy.polygon.technology
```

---

## 📈 Current Status & Honest Assessment
MintFlow successfully demonstrates the *experience* of gasless onboarding. The Firebase authentication, backend API routing, and smart wallet generation logic are fully functional. However, the final step of executing a live ERC-4337 UserOperation via a production Paymaster is currently mocked/simulated to ensure a reliable demo environment.

## 🧗 Challenges Faced
* **Complex Orchestration:** Connecting Firebase Auth securely to backend wallet generation required careful state management.
* **Infrastructure Reliability:** Ensuring a smooth demo experience led us to build a robust fallback/mock system when dealing with testnet RPC and Paymaster latencies.
* **Separation of Concerns:** Keeping the frontend completely unaware of blockchain complexity required rigorous API design on the Node backend.

## 🔭 Future Improvements
* Complete the transition from mock simulation to a live, production-grade ERC-4337 Bundler/Paymaster setup.
* Implement a Redis/BullMQ task queue to handle backend minting asynchronously at scale.
* Expand authentication options to include standard SIWE (Sign-In with Ethereum).

---

## 👥 Team Members
- **Aditya Pushpakar** - Backend Development, Smart Wallet Architecture, API Integration, Blockchain Workflow
- **Rishabh Shevde** - UI/UX Design, Product Design System, Frontend Experience Flow & Deployment
- **Jayani Trivedi** - Documentation, Project Coordination, System Structuring, README & Submission
- **Mrigesh Koyande** - Testing, System Review, Architecture Feedback, Hackathon Evaluation Support
 


---

## 🎮 Demo Instructions
1. Follow the **Setup Instructions** to run the frontend and backend locally.
2. Ensure Firebase `.env` variables are configured.
3. Open `http://localhost:5173` and click "Start Minting" for an instant anonymous login.
4. View your provisioned Smart Wallet address on the dashboard.
5. Click "Claim Digital Badge" to witness the gasless UX flow (simulated backend execution).
6. Verify the transaction status updates in the UI.

## 🌐 Deployment Status
- **Frontend:** Pending Deployment (Vercel/Firebase Hosting)
- **Backend:** Pending Deployment (Render/Railway)
- **Smart Contracts:** Targeted for Base Sepolia & Polygon Amoy
