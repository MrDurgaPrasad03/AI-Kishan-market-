# AI Kishan Market 🌾

An AI-assisted agricultural marketplace connecting farmers and buyers.

## Stack
- Frontend: React + Vite
- Backend: Java 21 + Spring Boot + Maven
- Database: MySQL
- Image storage: AWS S3 (planned)
- AI features: Mandi price advisor and Telugu assistant (planned)
- Frontend deployment: Vercel

## Repository structure
- `frontend/` — React application
- `backend/` — Spring Boot REST API
- `docs/` — architecture and API notes

## Current milestone
Project scaffold and first marketplace screen. Backend crop APIs and MySQL integration are next.

## Run frontend
```bash
cd frontend
npm install
npm run dev
```

## Run backend
Requires Java 21. From `backend/`:
```bash
./mvnw spring-boot:run
```
On Windows PowerShell:
```powershell
.\mvnw.cmd spring-boot:run
```

The backend currently exposes `GET /api/health` and `GET /api/crops` with sample data.
No credentials or secrets belong in source control.
