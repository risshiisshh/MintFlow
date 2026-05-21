# MintFlow Gasless Account Abstraction Backend

MintFlow Backend is a highly scalable, production-grade infrastructure platform built on Node.js, Express, TypeScript, and Firebase. It powers **gasless NFT minting** via **ERC-4337 Account Abstraction** using Safe smart contracts, viem, permissionless.js, and Pimlico bundlers.

## Features

1. **SIWE Authentication & JWT Sessions**: Passwordless cryptographic authentication via Ethereum signatures.
2. **Safe Account Abstraction**: Automatically calculates counterfactual Safe Smart Wallet addresses off-chain and deploys them on the fly.
3. **Gas Sponsorship (Paymaster)**: Abstract away gas fees completely. Backed by standard Paymaster integrations (Pimlico).
4. **Reliable Queue Pipeline**: Async transaction processing and automatic retries of failed gas transactions via BullMQ & Redis.
5. **Failed Transaction Explainer**: An intelligent rule-based engine that decodes raw contract revert logs and ERC-4337 errors (e.g. `AA21`) into plain English.
6. **Telemetry Analytics API**: Aggregates gas savings, network transaction distributions, and active smart wallets.

---

## Directory Structure

```
backend/
├── src/
│   ├── api/             # Express controllers & path router
│   ├── auth/            # SIWE verification & JWT signing
│   ├── blockchain/      # Safe factory + AA transaction relayers
│   ├── firebase/        # Firestore client SDK initialization
│   ├── jobs/            # BullMQ worker queue pipeline & workers
│   ├── middleware/      # JWT route authorization & rate limiters
│   ├── utils/           # Zod config checker & revert explainer
│   └── app.ts           # Express gateway and bootstrapping
├── Dockerfile           # Multi-stage production container setup
├── cloudbuild.yaml      # Google Cloud Build pipeline
├── .env.example         # Server configuration template
├── tsconfig.json        # TypeScript compile rules
└── package.json         # Module dependencies list
```

---

## Firestore Database Schemas

### `users` Collection
Stores registered user credentials.
- **Document ID**: `0x{eoaAddress}` (lowercase)
- **Fields**:
  ```json
  {
    "address": "0x71c...3e4b",
    "hasMinted": true,
    "lastLogin": "2026-05-20T20:00:00Z",
    "lastMintedAt": "2026-05-20T20:05:00Z",
    "createdAt": "2026-05-20T19:50:00Z"
  }
  ```

### `wallets` Collection
Maps the user's standard EOA to their deployed ERC-4337 Safe Smart Account.
- **Document ID**: `0x{eoaAddress}_{chain}` (lowercase EOA, e.g., `0x71c...3e4b_polygon`)
- **Fields**:
  ```json
  {
    "eoaAddress": "0x71c...3e4b",
    "smartAccountAddress": "0x890...4f5a",
    "chain": "polygon",
    "isDeployed": true,
    "createdAt": "2026-05-20T19:51:00Z"
  }
  ```

### `mint_transactions` Collection
Tracks the state of enqueued background transaction tasks.
- **Document ID**: `txRecordId` (Auto-generated Firestore key)
- **Fields**:
  ```json
  {
    "id": "A4g9Hkd03hKsdJ",
    "eoaAddress": "0x71c...3e4b",
    "smartAccountAddress": "0x890...4f5a",
    "chain": "polygon",
    "status": "success", // queued | processing | success | failed
    "transactionHash": "0xabc...def",
    "userOpHash": "0xabc...def",
    "error": null, // Stored on failure
    "explanation": null, // Stored on failure (plain English explanation)
    "createdAt": "2026-05-20T20:04:30Z",
    "updatedAt": "2026-05-20T20:05:00Z"
  }
  ```

### `analytics` Collection
System-wide metrics.
- **Document ID**: `global`
- **Fields**:
  ```json
  {
    "totalTransactions": 1420,
    "totalSponsoredUSD": 1245.50,
    "polygonTransactions": 980,
    "baseTransactions": 440,
    "activeWalletsCount": 612
  }
  ```

---

## API Documentation

All routes are prefixed with `/api`.

### 1. Authentication
* **GET `/api/auth/nonce`**
  * Description: Generates a cryptographically secure nonce for SIWE login.
  * Response: `200 OK`
    ```json
    { "nonce": "d8a1kS28f..." }
    ```

* **POST `/api/auth/verify`**
  * Description: Verifies SIWE message signature and returns a session JWT.
  * Request Body:
    ```json
    {
      "message": "SIWE formatted message...",
      "signature": "0x..."
    }
    ```
  * Response: `200 OK`
    ```json
    {
      "token": "eyJhbGciOiJIUzI...",
      "address": "0x71c...3e4b"
    }
    ```

### 2. Wallet & Account Abstraction (Protected)
Requires header `Authorization: Bearer <jwt_token>`.

* **GET `/api/wallet?chain=<chain>`**
  * Description: Resolves or computes the user's Safe Smart Account address.
  * Query parameters: `chain` (`polygon` | `base`)
  * Response: `200 OK`
    ```json
    {
      "smartAccountAddress": "0x890...4f5a",
      "isDeployed": false
    }
    ```

### 3. Gasless Transaction Pipeline (Protected)
Requires header `Authorization: Bearer <jwt_token>`.

* **POST `/api/mint`**
  * Description: Enqueues a gasless NFT mint transaction for the user's smart wallet.
  * Request Body:
    ```json
    { "chain": "polygon" }
    ```
  * Response: `202 Accepted`
    ```json
    {
      "message": "Transaction enqueued for processing",
      "txId": "A4g9Hkd03hKsdJ",
      "jobId": "A4g9Hkd03hKsdJ",
      "smartAccountAddress": "0x890...4f5a"
    }
    ```

* **GET `/api/mint/status/:id`**
  * Description: Retrieves the processing status of a queued transaction.
  * Response: `200 OK`
    ```json
    {
      "id": "A4g9Hkd03hKsdJ",
      "status": "failed",
      "transactionHash": null,
      "error": "revert: max supply reached",
      "explanation": "The smart contract rejected the transaction during execution. This usually happens because you have already minted the maximum limit of NFTs allowed for this smart account.",
      "createdAt": "2026-05-20T20:04:30Z",
      "updatedAt": "2026-05-20T20:05:00Z"
    }
    ```

### 4. Telemetry Telemetry (Public)
* **GET `/api/analytics`**
  * Description: Fetch global metrics.
  * Response: `200 OK`
    ```json
    {
      "totalTransactions": 1420,
      "totalSponsoredUSD": 1245.50,
      "polygonTransactions": 980,
      "baseTransactions": 440,
      "activeWalletsCount": 612
    }
    ```

---

## Local Development Setup

### 1. Prerequisites
- **Node.js**: v20.19+ (Vite 6 / Rolldown friendly)
- **Redis**: BullMQ requires an active Redis instance. You can run Redis locally via Docker:
  ```bash
  docker run -d --name mintflow-redis -p 6379:6379 redis:alpine
  ```

### 2. Configure Environment Variables
Copy `.env.example` and create a `.env` file:
```bash
cp .env.example .env
```
Provide the required endpoints:
- Firebase admin credentials
- RPC & Paymaster API keys for Polygon & Base networks.

### 3. Run Dev Server
Install dependencies and run standard script:
```bash
npm install
npm run dev
```

---

## Production Deployment

### Docker Container Build
Compile TypeScript code and package it into a multi-stage Docker container:
```bash
docker build -t mintflow-backend .
docker run -p 8080:8080 --env-file .env mintflow-backend
```

### Google Cloud Run Deployment
Deploy the container with a single command using Google Cloud Build:
```bash
gcloud builds submit --config cloudbuild.yaml --substitutions=_AR_REPO="your-artifact-repo-name"
```
The application will automatically deploy to a scalable, managed Google Cloud Run container.
