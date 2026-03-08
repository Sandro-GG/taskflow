# TaskFlow

A modern, full-stack Kanban-style task management application built to demonstrate proficiency in **React 19**, **Node.js**, **Prisma**, and **PostgreSQL**. This project showcases optimistic UI patterns, real-time database synchronization, and modular full-stack architecture.

## Features

* **Full-Stack Persistence**: Real-time CRUD operations synced with a PostgreSQL database via a RESTful Express API.
* **Optimistic UI & Rollbacks**: Instant drag-and-drop feedback with automatic state rollbacks if server synchronization fails.
* **TypeScript First**: End-to-end type safety from the database schema to the React components.
* **Modern Styling**: Sleek, responsive dark mode interface built with Tailwind CSS v4.
* **Dynamic Search & Filtering**: Real-time task filtering by title or description using optimized derived state patterns.

## Tech Stack

* **Frontend**: React 19, TypeScript, Vite, @hello-pangea/dnd
* **Backend**: Node.js, Express, Prisma ORM
* **Database**: PostgreSQL
* **Styling**: Tailwind CSS v4

## Setup

1. **Clone the repo:**
   `git clone https://github.com/Sandro-GG/taskflow`

2. **Backend Setup:**
   * Navigate to `/server`
   * Run `npm install`
   * Configure your `.env` with `DATABASE_URL`
   * Run `npx prisma generate`
   * Run `npm run dev`

3. **Frontend Setup:**
   * Navigate to root
   * Run `npm install`
   * Run `npm run dev`

4. **Environment Configuration**:
   * Create a `.env` file in the root directory.
   * Add `VITE_API_URL=http://localhost:5050`.
   * (The app will use this to communicate with the backend).   