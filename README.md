# MediNexus AI – MERN Edition

A full-stack healthcare management starter inspired by the supplied MediNexus AI reference project. It uses React + Vite, Node.js + Express, Mongoose, and MongoDB Atlas.

## Features
- JWT authentication with patient/provider/admin roles
- Provider dashboard with patient, appointment and alert summaries
- Patient registration and directory search
- Medical records and prescription details
- Appointment requests and provider status updates
- Patient consent grants/revocation
- Medication refill requests
- Patient messages and health alerts
- AI-style record summary and risk assessment endpoints (clearly marked demo logic)
- Optional Gemini API integration can be added server-side; no AI secret is exposed to React

## Requirements
Node.js 18+ and an Atlas MongoDB database.

## Setup
1. Extract the ZIP and open the `MediNexus-MERN` folder in VS Code.
2. Install root and application dependencies:
   ```bash
   npm install
   npm --prefix server install
   npm --prefix client install
   ```
3. Copy `server/.env.example` to `server/.env`. Add your MongoDB Atlas connection string and a long JWT secret.
4. Start both apps from the root folder:
   ```bash
   npm run dev
   ```
5. Open http://localhost:5173. API runs on http://localhost:5000.

## Demo accounts
Run `npm run seed` inside `server` after configuring the database.
- Provider: `doctor@medinexus.demo` / `Doctor123!`
- Patient: `patient@medinexus.demo` / `Patient123!`

## MongoDB Atlas setup
Create a free cluster, create a database user, allow your development IP in Network Access, copy the Node.js connection string, and place it in `MONGO_URI`. Replace `<password>` with your database user's password. Do not commit `.env`.

## Important implementation notes
- AI summary and risk scoring currently use transparent demo logic, not a validated medical model. Do not use outputs for diagnosis or treatment.
- This is an educational starter, not a production-ready medical-record system. Before real deployment add HTTPS, rate limiting, audit retention, encryption/key management, robust consent enforcement, backups, security review, and applicable healthcare/privacy compliance.
- The seeded accounts and data are fictional.
