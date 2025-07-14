# Job Importer System

A Node.js-based RSS job importer system built with Express.js, MongoDB, Bull (Redis), and XML parsing.

# Features

- Fetch jobs from multiple RSS feeds
- Parse and queue jobs for background processing
- Store jobs in MongoDB with upsert logic
- Track import logs (total jobs fetched, imported, failed)
- Real-time job processing with Bull and Redis

## 📁 Project Structure

├── src/
│ ├── models/ # Mongoose schemas (Job, ImportLog)
│ ├── services/ # Feed fetching logic
│ ├── queues/ # Bull queue setup
│ ├── workers/ # Worker processing jobs from queue
│ ├── controllers/ # Express route handlers
│ └── routes/ # API routes
├── .env # Environment variables
├── server.js # Express server
├── README.md # Project overview and setup
└── docs/
└── architecture.md # System design and decisions

## Tech Stack
Node.js + Express.js

MongoDB + Mongoose

Bull Queue + Redis

xml2js for RSS parsing

dotenv for environment configuration


---

## ✅ `/docs/architecture.md` (System Design & Decisions)

```markdown
# System Architecture – Job Importer

This document outlines the architectural design and rationale behind the Job Importer system.

---

## Components

### 1. Express.js API

- **Purpose**: Exposes routes to trigger manual imports and retrieve import logs.
- **Endpoints**:
  - `POST /manual-import`: Triggers job fetch & queue
  - `GET /import-logs`: Returns saved import history

### 2. MongoDB

- **Collections**:
  - `jobs`: Stores unique job entries (upsert by `jobId`)
  - `importlogs`: Tracks each feed import result with stats

### 3. Redis + Bull Queue

- **Queue**: `importJob`
- **Worker**: Background processor that parses, sanitizes, and stores jobs
- **Why Bull?**: Robust job queueing with retries, concurrency, and failure tracking

### 4. xml2js

- Converts XML RSS feeds into JavaScript objects for parsing.

---

## 🔁 Flow Diagram

```mermaid
graph TD
  A[manual-import API] --> B[fetchJobsFromFeeds()]
  B --> C[axios + xml2js]
  C --> D[For each job → Queue to Redis]
  D --> E[Worker (Bull)]
  E --> F[Mongoose: Upsert Job]
  F --> G[Save ImportLog]
