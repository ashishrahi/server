# System Architecture – Job Importer

This document outlines the architectural design and rationale behind the Job Importer system.

##  Components

### 1. Express.js API

- **Purpose**: Exposes routes to trigger manual imports and retrieve import logs.
- **Endpoints**:
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

## 🔁 Flow Diagram

```mermaid
graph TD
  A[manual-import API] --> B[fetchJobsFromFeeds()]
  B --> C[axios + xml2js]
  C --> D[For each job → Queue to Redis]
  D --> E[Worker (Bull)]
  E --> F[Mongoose: Upsert Job]
  F --> G[Save ImportLog]
```

##  Design Decisions

### 1. **Why RSS/XML?**
Many job boards offer RSS feeds for syndication, which are easily parsed using `xml2js`.

### 2. **Why Bull Queue?**
Queues decouple job fetching from processing. This ensures the API is responsive, and jobs are retried on failure.

### 3. **Why Upsert?**
To avoid duplicate job entries on each import, jobs are matched via `jobId` and updated if already existing.

### 4. **Why ImportLog?**
Every import run is tracked, aiding in debugging, analytics, and operational transparency.

##  Future Improvements

-  Add job deduplication logic based on title/company if `jobId` is missing
-  Add a dashboard to monitor logs and job statuses
-  Schedule automatic imports (e.g., via `node-cron`)
-  Add notifications (Slack/email) for failed jobs

## Deployment Notes

- CORS handled via `cors` middleware for frontend API consumption
- MongoDB Atlas + Redis Cloud recommended for production
