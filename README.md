# SSE 2026 — Science for the Sustainable Earth
### International Conference · Dept. of Geology & Geophysics, IIT Kharagpur · Nov 2–4, 2026

---

## Project Structure

```
sse-conference-2026/
├── apps/
│   ├── conference/          ← React + Vite frontend (port 5173)
│   └── api-server/          ← Node.js + Express backend (port 5000)
├── packages/
│   └── db/                  ← Prisma schema + PostgreSQL
├── package.json             ← Root npm workspace config
└── .env.example             ← Environment variable template
```

---

## Quick Start (3 steps)

### Step 1 — Prerequisites

Install these if you don't have them:

| Tool       | Download                           | Required Version |
|------------|------------------------------------|-----------------|
| Node.js    | https://nodejs.org (choose LTS)    | v18 or higher   |
| PostgreSQL  | https://www.postgresql.org/download| v14 or higher   |

---

### Step 2 — Set Up Environment Variables

**Create the database first** (using pgAdmin or psql):
```sql
CREATE DATABASE conference_db;
```

**Copy and fill in the env file:**
```
# In apps/api-server/, create a file called .env
# Copy the contents of apps/api-server/.env.example into it
# Then update DATABASE_URL with your PostgreSQL credentials
```

`apps/api-server/.env` contents:
```env
DATABASE_URL=postgresql://postgres:yourpassword@localhost:5432/conference_db
PORT=5000
ADMIN_PASSWORD=admin123
ADMIN_KEY=conf2026admin
FRONTEND_URL=http://localhost:5173
```

`packages/db/.env` contents (same DATABASE_URL):
```env
DATABASE_URL=postgresql://postgres:yourpassword@localhost:5432/conference_db
```

---

### Step 3 — Install, Migrate & Run

```bash
# 1. Navigate to the project folder
cd sse-conference-2026

# 2. Install all dependencies (root + all workspaces)
npm install

# 3. Generate the Prisma client
npm run db:generate

# 4. Push the schema to your PostgreSQL database
npm run db:push

# 5. Start both frontend and backend together
npm run dev
```

That's it! Open your browser at:
- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:5000/api/healthz
- **Admin dashboard:** Click "Admin Portal" in the footer (password: `iitkgp_professor_admin`)

---

## Running Individually

```bash
# Backend only
npm run dev:api

# Frontend only
npm run dev:web
```

---

## API Reference

| Method | Endpoint                                      | Description              |
|--------|-----------------------------------------------|--------------------------|
| GET    | `/api/healthz`                                | Health check             |
| POST   | `/api/register`                               | Submit registration      |
| GET    | `/api/registrations?adminKey=conf2026admin`   | List all registrations   |
| POST   | `/api/admin/login`                            | Get admin key            |

### POST /api/register — Request body
```json
{
  "name": "Dr. Jane Doe",
  "email": "jane@university.edu",
  "phone": "+91 98765 43210",
  "institution": "IIT Kharagpur",
  "presentationType": "oral",
  "theme": "Water Resources",
  "abstract": "Your abstract text here..."
}
```

---

## Database Schema (Prisma)

```prisma
model Registration {
  id               Int      @id @default(autoincrement())
  name             String
  email            String   @unique
  phone            String
  institution      String
  theme            String?
  abstract         String?
  presentationType String   @default("attendee")
  createdAt        DateTime @default(now())
}
```

---

## Environment Variables

| Variable         | Default             | Description                       |
|------------------|---------------------|-----------------------------------|
| DATABASE_URL     | (required)          | PostgreSQL connection string       |
| PORT             | 5000                | API server port                   |
| ADMIN_PASSWORD   | admin123            | Admin dashboard password          |
| ADMIN_KEY        | conf2026admin       | Token returned after admin login  |
| FRONTEND_URL     | http://localhost:5173 | Allowed CORS origin             |

---

## Troubleshooting

**`npm install` fails** → Make sure you have Node.js 18+ installed.

**Database connection error** → Check that PostgreSQL is running and your `DATABASE_URL` is correct.

**`npm run db:push` fails** → Make sure the `conference_db` database exists, and the user has write permissions.

**Port already in use** → Change `PORT=5000` in `.env` or kill the process on that port.

**Frontend can't reach API** → The Vite proxy is pre-configured to forward `/api` requests to `http://localhost:5000`. Make sure the API server is running first.

---

## Tech Stack

| Layer     | Technology                    |
|-----------|-------------------------------|
| Frontend  | React 18, Vite 5, Tailwind CSS, react-hook-form, framer-motion |
| Backend   | Node.js, Express 4, CORS, dotenv |
| Database  | PostgreSQL + Prisma ORM        |
| Monorepo  | npm workspaces                 |
