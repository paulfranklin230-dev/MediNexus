# Project conversion notes

## Reference features carried into this MERN version
The supplied reference describes provider/hospital management, a patient portal, patient records, appointments, consent management, refill requests, messages, health alerts, and AI-assisted summaries/risk insights. This starter recreates the core workflows with React, Express REST APIs, and MongoDB/Mongoose.

## Current scope and limitations
- Implemented API workflows: login/register, role checks, patient CRUD, medical-record CRUD/create/list, appointment create/list/status, patient overview, refill requests/status, messages, health alerts, dashboard counts, consent create/list/revoke, demo record summary, demo risk score.
- Frontend workflows: sign-in, provider dashboard, patient directory, record creation/list and summary, appointment management, health alerts, refill requests, messages, patient portal, appointment requests, refill submission.
- Consent records can be created and revoked, but this starter does not yet enforce every consent grant as a complete authorization policy on every clinical read/write endpoint. Do not use real patient data until that is implemented and security-reviewed.
- AI summary and risk assessment are demo implementations. They do not call Gemini or any validated clinical model.
- No live hospital, wearable, medical imaging, payment, video-call, blood-bank, emergency-bed, or blockchain integration is included.
- Authentication uses JWT and bcrypt password hashing. This is a learning foundation, not a complete production healthcare security/compliance implementation.

## Run commands
From project root:

```bash
npm install
npm --prefix server install
npm --prefix client install
```

Create `server/.env` from `server/.env.example`, then:

```bash
npm --prefix server run seed
npm run dev
```

Provider demo: `doctor@medinexus.demo` / `Doctor123!`
Patient demo: `patient@medinexus.demo` / `Patient123!`
