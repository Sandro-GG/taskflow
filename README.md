# TaskFlow

A full-stack Kanban-style task management app built with React, Node.js, Prisma, and PostgreSQL.

**Live Demo:** https://taskflow-sandro.vercel.app
**API:** https://taskflow-server-063n.onrender.com

---

## Features

* **AI Sub-task Suggestions**
  Generate relevant sub-tasks using the Anthropic Claude API.

* **Drag & Drop Kanban Board**
  Smooth task movement with optimistic UI updates and rollback on failure.

* **Full-Stack Persistence**
  Tasks are stored in PostgreSQL via a RESTful Express API.

* **Search & Filtering**
  Real-time filtering by title and description.

* **Type-Safe Architecture**
  End-to-end TypeScript from frontend to database.

---

## Tech Stack

* **Frontend:** React 19, TypeScript, Vite, Tailwind CSS
* **Backend:** Node.js, Express
* **Database:** PostgreSQL (via Prisma ORM)
* **AI:** Anthropic Claude API
* **Testing:** Jest, Supertest

---

## Architecture

* Frontend communicates with a REST API
* Backend handles business logic and database access
* Prisma ORM manages database schema and queries
* PostgreSQL stores persistent task data
* AI suggestions generated via Claude API

---

## Getting Started

### 1. Clone the repo

```
git clone https://github.com/Sandro-GG/taskflow
cd taskflow
```

---

### 2. Backend setup

```
cd server
npm install
```

Create `.env`:

```
DATABASE_URL=your_postgres_url
ANTHROPIC_API_KEY=your_api_key
```

Run:

```
npx prisma generate
npx prisma migrate dev
npm run dev
```

---

### 3. Frontend setup

```
cd ..
npm install
```

Create `.env`:

```
VITE_API_URL=http://localhost:5050
```

Run:

```
npm run dev
```

---

## Testing

```
cd server
npm test
```

Covers:

* `GET /tasks` returns 200 and array
* `POST /tasks` validation

---

## Deployment

* **Frontend:** Vercel
* **Backend:** Render
* **Database:** Render PostgreSQL

Environment variables:

Frontend:

```
VITE_API_URL=https://taskflow-server-063n.onrender.com
```

Backend:

```
DATABASE_URL=your_postgres_url
ANTHROPIC_API_KEY=your_api_key
```

---

## Notes

* Uses optimistic UI updates for smooth UX
* Automatically rolls back state if server sync fails
* Designed as a production-style full-stack project

---
