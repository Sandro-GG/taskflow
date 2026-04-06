# TaskFlow

A full-stack Kanban-style task management app built with React 19, Node.js, Prisma, and PostgreSQL. Features AI-powered task suggestions via the Claude API, optimistic UI with automatic rollbacks, and a modular full-stack architecture.

## Features

* **AI Sub-task Suggestions**: Uses the Anthropic Claude API to suggest relevant sub-tasks based on your task title and description — one click appends them to the task.
* **Full-Stack Persistence**: CRUD operations synced with PostgreSQL via a RESTful Express API.
* **Optimistic UI & Rollbacks**: Drag-and-drop gives instant visual feedback, with automatic state rollbacks if the server sync fails.
* **TypeScript First**: End-to-end type safety from the database schema to the React components.
* **Modern Styling**: Responsive dark mode interface built with Tailwind CSS v4.
* **Dynamic Search & Filtering**: Real-time task filtering by title or description.

## Tech Stack

* **Frontend**: React 19, TypeScript, Vite, @hello-pangea/dnd
* **Backend**: Node.js, Express, Prisma ORM
* **Database**: PostgreSQL
* **AI**: Anthropic Claude API (claude-haiku)
* **Styling**: Tailwind CSS v4
* **Testing**: Jest, Supertest

## Setup

1. **Clone the repo:**
   ```
   git clone https://github.com/Sandro-GG/taskflow
   ```

2. **Backend setup:**
   ```
   cd server
   npm install
   ```
   Create a `.env` file in `/server` with:
   ```
   DATABASE_URL=your_postgres_url
   ANTHROPIC_API_KEY=your_api_key
   ```
   Then run:
   ```
   npx prisma generate
   npm run dev
   ```

3. **Frontend setup:**
   ```
   cd ..
   npm install
   ```
   Create a `.env` file in the root with:
   ```
   VITE_API_URL=http://localhost:5050
   ```
   Then run:
   ```
   npm run dev
   ```

## Testing

Backend tests are written with Jest and Supertest. To run:

```
cd server
npm test
```

Tests cover:
- `GET /tasks` returns a 200 and an array
- `POST /tasks` returns 400 when title is missing