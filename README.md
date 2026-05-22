# 🌊 MintFlow

**[Live Deployment on Google Cloud Run](https://mintflow-970680264240.europe-west1.run.app/)**

Gasless Web3 Onboarding Infrastructure for Seamless NFT Credential Minting

## 🚀 Overview

MintFlow is a full-stack Web3 onboarding prototype designed to eliminate the friction of traditional blockchain interaction.

It enables users to:

- Log in instantly using Firebase authentication
- Automatically receive a smart wallet
- Mint NFT-based credentials
- Experience gasless onboarding through a simulated Account Abstraction layer

The goal is simple:

Make Web3 feel like Web2 — without sacrificing blockchain architecture design.

## 🛑 Problem

Web3 onboarding today is broken:

- Users must install wallets
- Manage seed phrases
- Acquire ETH/MATIC for gas fees
- Understand complex transaction flows

This creates extreme friction and causes major user drop-off before product interaction.

## 💡 Solution

MintFlow removes onboarding friction by introducing:

- Instant Firebase authentication (no wallet required initially)
- Backend-generated smart wallet abstraction
- Gasless transaction simulation using UGF-inspired architecture
- Simplified NFT credential minting flow

## ⚙️ System Architecture
```text
Frontend (React + Vite)
        ↓
Firebase Authentication
        ↓
Node.js / Express Backend
        ↓
Smart Wallet Generation Layer
        ↓
Simulated / Planned ERC-4337 Layer
        ↓
NFT Credential Minting Flow
```

## 🔑 Key Features
### ✅ Fully Working
- Firebase Authentication (Email / Anonymous login)
- Backend API integration (Express.js)
- Smart wallet generation tied to Firebase UID
- Frontend onboarding flow (React + Vite)
- Wallet API (/api/wallet)
- AuthContext session management

### 🧪 Simulated (Hackathon Demo Layer)
- Gasless transaction execution flow
- Minting lifecycle (pending → processing → success)
- Paymaster / Bundler abstraction (conceptual)
- NFT mint success simulation
- Smart account deployment status UI

### ❌ Not Fully Implemented Yet
- Real ERC-4337 UserOperation execution
- Live Paymaster + Bundler integration (Pimlico)
- On-chain NFT mint confirmation
- Redis / BullMQ async worker system
- Production-grade smart contract execution flow

## 🔐 Authentication Flow
1. User logs in via Firebase (instant onboarding)
2. Firebase generates ID token
3. Backend verifies token via Firebase Admin SDK
4. UID is mapped to a smart wallet address
5. Wallet is returned to frontend for interaction

## 👛 Wallet System
- Smart wallet is generated per authenticated user
- Mapping stored in Firestore
- Backend acts as orchestration layer
- Deployment status tracked (isDeployed: false in demo mode)

## 🧪 Minting Flow
1. User clicks Start Minting
2. Frontend sends request to backend
3. Backend validates user session
4. Wallet + mint request is processed
5. UI displays simulated gasless transaction lifecycle
6. Final success state is returned (demo mode)

## 🧠 What Makes This System Special

MintFlow demonstrates:

- Account Abstraction-inspired architecture
- Backend-driven wallet orchestration
- Gasless UX simulation layer
- Seamless Web2-like onboarding experience
- Modular design ready for ERC-4337 upgrade

## 🧪 Demo Behavior

MintFlow currently operates in a hybrid mode:

**✔ Real:**
- Authentication
- Backend APIs
- Wallet generation logic
- Frontend-backend integration

**🧪 Simulated:**
- Blockchain mint execution
- Gas sponsorship (Paymaster abstraction)
- Transaction confirmation lifecycle

## 🚀 Tech Stack
**Frontend**
- React 19
- Vite
- Tailwind CSS

**Backend**
- Node.js
- Express.js
- Firebase Admin SDK

**Infrastructure (Planned / Partial)**
- ERC-4337 (Account Abstraction)
- Pimlico Bundler + Paymaster
- Base / Polygon networks

## 📡 API Endpoints
| Endpoint | Method | Description |
|---|---|---|
| `/api/auth/session` | POST | Firebase token verification |
| `/api/wallet` | GET/POST | Smart wallet generation |
| `/api/mint` | POST | Mint request handler (simulated) |

## ⚠️ Known Limitations
- Minting is not fully executed on-chain
- Paymaster + Bundler integration is incomplete
- Redis worker system is inactive
- Some flows use simulation for stability and demo reliability

## 🔭 Future Scope
- Full ERC-4337 implementation (real gasless minting)
- Live Paymaster integration
- Redis + BullMQ async processing system
- SIWE (Sign-In with Ethereum) authentication
- Multi-chain expansion (Base + Polygon + others)
- Production-grade NFT credential system

## 🧑‍💻 Team
- Aditya Pushpakar — Backend & Infrastructure
- Rishabh Shevde — UI/UX + Architecture + System Fixes
- Mrigesh Koyande— Testing & Validation
- Jayani Trivedi — Documentation & Coordination

## 🎯 Final Vision

MintFlow is not just an NFT minting app.

It is a Web3 onboarding infrastructure layer designed to:

- Remove onboarding friction
- Abstract blockchain complexity
- Enable instant user participation
- Turn NFTs into meaningful credentials

## 🏁 Conclusion

MintFlow bridges the gap between Web2 simplicity and Web3 infrastructure.

It demonstrates how users can interact with blockchain systems without ever needing to understand gas fees, wallets, or seed phrases — while still preserving a scalable architecture for real ERC-4337 deployment.


