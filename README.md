# ResumeAI - AI-Powered Resume Analyzer & Job Tracker

A full-stack MERN application built with React, Express, MongoDB, and OpenAI.

## Features
- **AI Resume Analysis**: Upload PDF resumes for scoring and improvement suggestions.
- **Cover Letter Generator**: Generate tailored cover letters based on your resume and job descriptions.
- **Job Tracker**: Manage your job applications with status tracking and priority levels.
- **Dashboard**: Visualize your application stats and get follow-up reminders.

## Tech Stack
- **Frontend**: React, Tailwind CSS, Recharts, Framer Motion
- **Backend**: Node.js, Express, Mongoose
- **AI**: OpenAI GPT-4o
- **Deployment**: Vercel (Frontend + Backend)

## Deployment on Vercel

To deploy this project on Vercel as a single monorepo:

1. **Push to GitHub**: Create a new repository and push the code.
2. **Import to Vercel**: Connect your GitHub repository.
3. **Configure Project**:
   - **Framework Preset**: Vite
   - **Root Directory**: `client` (Vercel will handle the frontend build here)
4. **Environment Variables**:
   Add the following in Vercel Project Settings:
   - `MONGODB_URI`: Your MongoDB connection string
   - `JWT_SECRET`: A random string for auth
   - `OPENAI_API_KEY`: Your OpenAI API key
   - `VITE_API_URL`: Your Vercel deployment URL (e.g., `https://resume-ai.vercel.app`)

### Backend Configuration
The backend is configured to run as Vercel Serverless Functions. The `vercel.json` in the root handles routing `/api` requests to the `server/index.js`.

## Local Development
1. Clone the repo
2. Install dependencies in both `client` and `server` folders: `npm install`
3. Create `.env` files in both folders with required keys.
4. Run server: `cd server && npm start`
5. Run client: `cd client && npm run dev`
