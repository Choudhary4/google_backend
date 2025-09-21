# Backend on Vercel

This Express + MongoDB API is configured to run on Vercel using a serverless function entry.

## Endpoints
- GET `/` – Health check
- All routes under `/api/auth/*` – Auth routes

## Files
- `server.js` – Express app definition and Mongo connection
- `api/index.js` – Vercel serverless entry, exports the Express app
- `vercel.json` – Build and routing configuration

## Environment Variables
Set in Vercel Project Settings → Environment Variables:
- `MONGODB_URI` – Your Mongo connection string
- `FRONTEND_ORIGIN` – Optional. CORS allowed origin (e.g., `https://your-frontend.vercel.app`)

## Local Dev
```
npm install
npm run dev
```

## Deploy
- Push this folder to a GitHub repo
- Import the `backend` folder as a project in Vercel
- Set the env vars
- Deploy

Note: The app only calls `app.listen()` when not on Vercel, so serverless runtime works correctly.