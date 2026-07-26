# Find Nearby Ambulances and Doctors

<img src="illustration.jpeg" width="100%" alt="Find Nearby Ambulances or Doctors">



## 🚀 Quick Start

### Prerequisites

- **Node.js** ≥ 18
- **npm** ≥ 9

### Setup

```bash
# 1. Clone the repository
git clone <repo-url>
cd Find-Nearby-Ambulances-and-Doctors

# 2. Install all dependencies (root + client + server)
npm install

# 3. Copy environment config
cp .env.example .env

# 4. Seed the database with sample data
npm run seed --workspace=server

# 5. Start both client and server in development mode
npm run dev
```

The app will be available at:
- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:3001/api/services
- **Health check:** http://localhost:3001/api/health

### Run Tests

```bash
# Backend integration tests
npm test --workspace=server

# Frontend component tests
npm test --workspace=client
```

## 🔗 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/health` | Health check |
| `GET` | `/api/services` | List services (paginated, filterable, searchable) |
| `GET` | `/api/services/:id` | Get a single service by ID |
| `POST` | `/api/services` | Create a new service |
| `PUT` | `/api/services/:id` | Update an existing service |
| `DELETE` | `/api/services/:id` | Delete a service |

### Query Parameters (GET /api/services)

| Param | Type | Default | Description |
|-------|------|---------|-------------|
| `page` | number | 1 | Page number |
| `limit` | number | 10 | Records per page (max 100) |
| `type` | string | — | Filter by `ambulance` or `doctor` |
| `search` | string | — | Search by title or location |

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19, TypeScript, Vite 8, styled-components |
| Backend | Node.js, Express 4, TypeScript |
| Database | SQLite via sql.js (zero native dependencies) |
| Validation | Zod (shared schemas) |
| Testing | Jest, Supertest |
| Dev Tools | concurrently, tsx (watch mode) |



## 🤖 AI Usage

See [docs/AI_USAGE.md](docs/AI_USAGE.md) for a detailed transparency log of how AI was used throughout development.

