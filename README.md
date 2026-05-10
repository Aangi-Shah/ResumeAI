# ResumeAI – AI-Powered Resume Analyzer & Job Tracker

ResumeAI is a complete **MERN-stack AI application** that helps job seekers analyze their resumes, generate tailored cover letters, and track job applications — all in one place, powered by Google Gemini AI.

The project includes:
- **Frontend (React + Vite)**
- **Backend API (Node.js + Express + MongoDB)**

---

# Live Demo
**Frontend (Vercel):** https://resume-ai-ft.vercel.app/login
**Backend (Vercel):** https://resume-ai-flame-sigma.vercel.app

---

# Tech Stack

## Frontend
- React.js
- Vite
- Tailwind CSS
- Axios
- React Router DOM
- Recharts
- Framer Motion

## Backend
- Node.js
- Express.js
- MongoDB (Mongoose)
- Multer (PDF Upload)
- JSON Web Token (JWT)
- Bcrypt
- pdf-parse (PDF Text Extraction)

## AI
- Google Gemini API (gemini-1.5-flash)

## Database
- MongoDB Atlas

---

# Key Features

## User Features
- Account Registration & Login (JWT)
- Upload Resume as PDF
- **AI Resume Analysis** — Score out of 100, strengths,
  weaknesses, ATS keywords, improved bullet points
- **AI Cover Letter Generator** — Paste any job description
  and get a tailored cover letter based on your resume
- **Job Application Tracker** — Add, edit, delete applications
- Track status per application: Applied / Interview Scheduled / Interview Done / Offer Received / Rejected
- Set priority per application: High / Medium / Low
- Dashboard with application stats and charts

## Dashboard Features
- Total applications count
- Interview rate percentage
- Rejection rate percentage
- Offers received count
- Bar chart — applications submitted per week
- Pie chart — status breakdown across all applications
- Recent applications list with status badges

## Backend Features
- Node.js + Express REST API
- MongoDB with Mongoose
- JWT Authentication with protected routes
- PDF text extraction using pdf-parse
- Gemini AI API integration for resume analysis and cover letter generation
- Multer for PDF file upload handling

## Resume Analysis (AI)
- Upload PDF resume and paste job description
- AI extracts and reads full resume content
- AI compares the extracted content to the job description provided
- Returns structured analysis:
  * Overall score out of 100
  * Strengths — what is working well
  * Weaknesses — what is missing
  * ATS keywords missing from the resume
  * Improved bullet points for experience section
  * One line candidate summary

## Cover Letter Generator (AI)
- Paste job description
- AI reads your uploaded resume
- Generates a fully customized professional cover letter
- Copy to clipboard
- Download as PDF

## Authentication
- JWT login and registration
- Bcrypt password hashing
- Protected routes via JWT middleware

---

## Project Structure

```
ResumeAI/
│
├── server/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── node_modules/
│   ├── index.js
│   ├── .gitignore
│   ├── .env
│   ├── package.json
│   └── package-lock.json
│
├── client/
│   ├── node_modules/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── context/
│   │   ├── hooks/
│   │   ├── pages/
│   │   ├── utils/
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── .gitignore
│   ├── .env
│   ├── index.html
│   ├── package.json
│   ├── package-lock.json
│   ├── vite.config.js
│   └── postcss.config.cjs
│   └── tailwind.config.js
│
└── README.md
```

---

# Setup & Installation

## **1. Clone the Repository**

```bash
git clone https://github.com/Aangi-Shah/ResumeAI.git
cd ResumeAI
```

---

## **2. Create a `.env` file in the server directory with:**

```
MONGODB_URI = your_mongodb_url
JWT_SECRET = your_jwt_secret_key
GEMINI_API_KEY = your_google_gemini_api_key
PORT = your_backend_port
```

---

## **3. Create a `.env` file in the client directory with:**

```
VITE_API_URL = your_backend_port
```

---

## **4. Setup Backend**

```bash
cd server
npm install
npm run dev
```

---

## **5. Setup Frontend**

```bash
cd client
npm install
npm run dev
```

---

# API Highlights

## Auth

```
POST   /api/auth/register
POST   /api/auth/login
```

## Resume

```
POST   /api/resume/analyze
POST   /api/resume/cover-letter
```

## Applications

```
GET    /api/applications
POST   /api/applications
PUT    /api/applications/:id
DELETE /api/applications/:id
```

## Dashboard

```
GET    /api/stats/dashboard
```

---

# Authors

Aangi Shah

---

# License

This project is for academic and portfolio purposes.