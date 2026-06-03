# Creatokite

Creatokite is an AI-powered creator campaign operating system that connects brands and creators, streamlines campaign workflows, and helps admins approve high-quality creators using a data-backed **Creator Automation Score (CAS)**.

## Key Features

- **Role-based platform** for Admin, Brand, and Creator users
- **Creator profile analysis** from social profile URLs (YouTube and Instagram support)
- **CAS scoring engine** with weighted metrics and risk-level output
- **Admin approval workflow** with one-click approve/reject actions
- **Creator analytics dashboard** including CAS breakdown visualizations
- **Campaign management tools** for creating and running influencer campaigns
- **Security hardening** with rate limiting, validation, sanitization, and secure headers

## Tech Stack

- **Frontend:** React, Vite, React Router, Recharts, Axios
- **Backend:** Node.js, Express, MongoDB, Mongoose
- **Auth/Security:** JWT, Helmet, express-rate-limit, express-validator, mongo-sanitize

## Project Structure

```text
creatokite/
├── backend/    # Express API, DB models, business logic, seed scripts
├── frontend/   # React + Vite SPA
├── SETUP.md    # detailed local setup guide
├── DEPLOY.md   # production deployment guide
└── CHANGES.md  # release/change notes
```

## Prerequisites

- Node.js **20.x** (recommended)
- npm
- MongoDB Atlas connection string (or local MongoDB)

## Quick Start

### 1) Install dependencies

```bash
cd backend
npm install

cd frontend
npm install
```

### 2) Configure environment

```bash
cd backend
cp .env.example .env
```

Update `backend/.env` with at least:

- `MONGODB_URI`
- `JWT_SECRET`
- `JWT_REFRESH_SECRET`
- `COOKIE_SECRET`
- `CLIENT_URL`

Optional APIs for richer social data:

- `YOUTUBE_API_KEY`
- `RAPIDAPI_KEY`

### 3) Seed demo data (recommended)

```bash
cd backend
npm run seed
```

### 4) Run the app

```bash
# backend
cd backend
npm run dev

# frontend (new terminal)
cd frontend
npm run dev
```

Open: `http://localhost:5173`

## Demo Credentials (after seeding)

| Role | Email | Password |
|---|---|---|
| Admin | `admin@creatokite.com` | `Admin@12345` |
| Brand | `brand@demo.com` | `Demo@12345` |
| Creator | `creator1@demo.com` | `Demo@12345` |

## CAS Scoring Snapshot

CAS combines weighted dimensions including engagement quality, audience reach, authenticity, posting consistency, growth, brand safety, conversion potential, and content quality.

- **Badges:** ELITE (90+), VERIFIED (75+), STANDARD (50+), REVIEW (<50)
- **Auto-approval rule:** CAS ≥ 75 and LOW risk

## Useful Scripts

### Backend (`backend/package.json`)

- `npm run dev` — start API with nodemon
- `npm start` — start API in production mode
- `npm run seed` — seed demo users and campaigns
- `npm run setup` — setup Instagram-related tooling

### Frontend (`frontend/package.json`)

- `npm run dev` — start Vite dev server
- `npm run build` — create production build
- `npm run preview` — preview production build

## Documentation

- Setup details: `SETUP.md`
- Deployment guide: `DEPLOY.md`
- Change history: `CHANGES.md`

## License

No explicit license file is present in this repository.
