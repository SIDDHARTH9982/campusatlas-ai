# CampusAtlas AI

A multi-tenant AI chatbot SaaS platform for schools, colleges, and universities. 

## Business Model
- **Institutions:** Buy subscription plans to manage their detailed data (courses, fees, hostel, placements, notices, FAQs, and AI knowledge).
- **Students:** Pay a one-time fee to unlock access to all active institutions. The AI chatbot provides answers strictly scoped to the student's currently selected institution to avoid hallucinations and data mixing.

## Tech Stack
- **Frontend:** React + Vite, Tailwind CSS, Framer Motion, React Router, Axios, Lucide React
- **Backend:** Node.js, Express, MongoDB (Mongoose), JWT Auth
- **AI Model:** Google Gemini (1.5 Flash) via `@google/generative-ai`

## Setup Instructions

### 1. Backend Setup
1. Open terminal and navigate to the `backend` folder.
   ```bash
   cd backend
   ```
2. Install dependencies.
   ```bash
   npm install
   ```
3. Create a `.env` file (copy `.env.example`).
   ```bash
   cp .env.example .env
   ```
   Fill in your `MONGODB_URI`, `JWT_SECRET`, and `GEMINI_API_KEY`.
4. Run the database seed to create 3 demo institutions, admin accounts, students, and full data.
   ```bash
   npm run seed
   ```
5. Start the backend server.
   ```bash
   npm run dev
   ```

### 2. Frontend Setup
1. Open a new terminal and navigate to the `frontend` folder.
   ```bash
   cd frontend
   ```
2. Install dependencies.
   ```bash
   npm install
   ```
3. Start the Vite dev server.
   ```bash
   npm run dev
   ```

## Demo Accounts (created by seed)

- **Super Admin:** `admin@campusatlas.ai` / `Admin@123`
- **Institution Admin (Meridian):** `admin@meridian.edu.in` / `Meridian@123`
- **Institution Admin (Oakfield):** `admin@oakfield.edu.in` / `Oakfield@123`
- **Student (Paid User):** `rahul@student.com` / `Student@123`

## Features Built
- Full multi-tenant data isolation.
- `institutionId` enforcement across all 15+ data models.
- JWT Role-based guards (`superadmin`, `institutionAdmin`, `student`).
- Multi-tenant RAG service fetching tailored context for the selected institution.
- Interactive multi-session chat history.
- Original premium deep-space dark UI design.
