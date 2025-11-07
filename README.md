# AI Resume Analyzer

A small web app that analyzes resumes and gives ATS compatibility, extracted skills, strengths/weaknesses and suggestions to improve. Built as a full-stack demo that wires file parsing, a lightweight backend, and an AI-based analysis step.


## What it does
- Upload a PDF or DOCX resume and get a machine-generated analysis.
- Extracts skills and important resume sections.
- Produces an ATS (applicant tracking system) compatibility score (0–100).
- Highlights strengths, weaknesses, and gives concrete suggestions.
- Optional job-description matching to show missing and matched skills.


## How it works (high level)
- Frontend (React + Vite) handles user flows: auth, file upload, dashboard, and results.
- Backend (Express) accepts uploaded files, extracts text (pdf-parse, mammoth), and forwards the text to an AI analysis service.
- AI step uses a generative model to produce a structured JSON analysis (score, skills, strengths, weaknesses, suggestions).
- Results are stored and surfaced in the dashboard with a visual ATS score and detail pages.

## Tech stack
- Frontend: React, Vite, Tailwind CSS
- Backend: Node.js, Express
- Parsing: pdf-parse (PDF), mammoth (DOCX)
- Database: MongoDB (Mongoose)
- AI: Google Generative AI (Gemini) integration (via a small wrapper)
- Misc: multer for file uploads, JWT for auth

## Quick start
1. Clone the repo.

2. Backend
   - cd backend
   - npm install
   - create a `.env` file with at least:
     ```
     MONGODB_URI=<your mongo connection string>
     JWT_SECRET=<a secure random string>
     GEMINI_API_KEY=<optional, required for AI analysis>
     ```
   - Start dev server: `npm run dev` (this runs `nodemon server.js`)

3. Frontend
   - cd frontend
   - npm install
   - Start dev server: `npm run dev`


## API 

#### Register
   - POST /api/auth/register
   - Body (application/json): { "name": "...", "email": "...", "password": "..." }
   - Success response: 201
      { "success": true, "message": "User registered successfully", "token": "<jwt>", "user": { "id": "...", "name": "...", "email": "..." } }

#### Login
   - POST /api/auth/login
   - Body: { "email": "...", "password": "..." }
   - Success response: 200
      { "success": true, "message": "Login successful", "token": "<jwt>", "user": { "id": "...", "name": "..." } }

#### Get current user
   - GET /api/auth/me
   - Headers: Authorization: Bearer <token>
   - Success: 200 { "success": true, "user": { "_id": "...", "name": "...", "email": "..." } }

#### Upload & analyze resume
   - POST /api/resume/analyze
   - Headers: Authorization: Bearer <token>
   - Body: multipart/form-data (field name: resume) — PDF or DOCX
   - Success: 200
      {
         "success": true,
         "message": "Resume analyzed successfully",
         "data": {
            "id": "<analysisId>",
            "fileName": "resume.pdf",
            "atsScore": 78,
            "skills": ["JavaScript","React"],
            "strengths": [...],
            "weaknesses": [...],
            "suggestions": [...],
            "createdAt": "..."
         }
      }

#### Match job description
   - POST /api/resume/match-job/:analysisId
   - Headers: Authorization: Bearer <token>
   - Body (application/json): { "jobDescription": "..." }
   - Success: 200
      { "success": true, "message": "Job matching completed", "data": { "matchScore": 72, "missingSkills": [...], "matchedSkills": [...], "recommendations": [...] } }

#### List analyses
   - GET /api/resume/my-analyses
   - Headers: Authorization: Bearer <token>
   - Success: 200 { "success": true, "count": 3, "data": [ { analysis summary... }, ... ] }

#### Get analysis detail
   - GET /api/resume/analysis/:id
   - Headers: Authorization: Bearer <token>
   - Success: 200 { "success": true, "data": { full analysis object (includes resumeText) } }

#### Delete analysis
   - DELETE /api/resume/analysis/:id
   - Headers: Authorization: Bearer <token>
   - Success: 200 { "success": true, "message": "Analysis deleted successfully" }
