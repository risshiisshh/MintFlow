# MintFlow Deployment & Handoff Guide

Welcome to the MintFlow infrastructure! This guide is intended for team members who will be managing deployments, making architectural changes, or taking over the Cloud Run operations.

## Architecture Overview
MintFlow is now configured as a **Single-Container Monolith** for production deployment.
- **Why?** It avoids CORS issues entirely, reduces Google Cloud costs by deploying a single service, and simplifies our continuous integration pipeline.
- **How it Works:** The Node.js Express backend serves as an API Gateway *and* a static file server. Any incoming request that does not match `/api/*` is routed to the compiled React frontend (`index.html`).

## 1. Project Structure
- `src/`: React frontend code (built with Vite).
- `backend/src/`: Node.js/Express backend code (built with `tsc`).
- `Dockerfile`: The multi-stage build instructions that compile both frontend and backend, merging them into a single production image.
- `.dockerignore`: Prevents local `node_modules` and `.env` files from bloating the Docker build context. **Do not commit `.env` files to Git!**

## 2. Local Development vs. Production
**Local Development:**
You will still run the frontend and backend separately to benefit from Hot-Module Replacement (HMR).
- Frontend: `npm run dev` (Runs Vite on `localhost:5173`)
- Backend: `cd backend && npm run dev` (Runs `nodemon` on `localhost:8080`)

**Production:**
The React frontend detects it is in production and uses relative API paths (e.g., `/api/mint` instead of `http://localhost:8080/api/mint`). The Docker container serves both on port `8080`.

## 3. Deployment Instructions (Google Cloud Run)

To deploy the latest changes to Google Cloud Run, follow these exact steps:

### Prerequisites
1. Install the [Google Cloud CLI](https://cloud.google.com/sdk/docs/install).
2. Authenticate: `gcloud auth login`
3. Set your project: `gcloud config set project [YOUR_GCP_PROJECT_ID]`

### Step-by-Step Deployment
Ensure you are in the root directory (`MintFlow/`), then run:

```bash
gcloud run deploy mintflow-app \
  --source . \
  --region us-central1 \
  --allow-unauthenticated \
  --port 8080 \
  --set-env-vars="NODE_ENV=production,PORT=8080,VITE_FIREBASE_API_KEY=...,VITE_FIREBASE_AUTH_DOMAIN=...,FIREBASE_PROJECT_ID=...,FIREBASE_PRIVATE_KEY=...,POLYGON_RPC_URL=...,BASE_RPC_URL=..."
```

*(Note: Since `.env` files are ignored by Docker for security, you **must** inject all required environment variables using the `--set-env-vars` flag or configure them via the Google Cloud Console / Secret Manager).*

## 4. Making Future Changes

### Modifying the Frontend
- Make changes in `/src`.
- No deployment configuration changes are needed; the Dockerfile will automatically run `npm run build` using Vite during the next deployment.

### Modifying the Backend
- Make changes in `/backend/src`.
- If you add new routes, ensure they start with `/api/` so they don't conflict with the React router catch-all block in `app.ts`.
- If you install a new package, make sure to run `npm install` inside the `/backend` folder so `backend/package.json` is updated.

### Adding New Environment Variables
1. Add them to your local `.env` and `backend/.env` for testing.
2. Update the `AuthContext.jsx` or backend config to utilize the new variables.
3. **Crucial:** Remember to add the new variables to your `gcloud run deploy --set-env-vars=...` command, or add them manually in the GCP Cloud Run console under "Edit & Deploy New Revision -> Variables & Secrets".

---
*Happy deploying! If the build fails, check the Google Cloud Build logs for specific typescript (`tsc`) or Vite compilation errors.*
