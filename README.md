<div align="center">

# 🚑 Find Nearby Ambulances & Doctors

A modern full-stack web application that helps users manage and discover nearby ambulance services and doctors. Built as a coding challenge using React, TypeScript, Node.js, and SQLite.

### Live Demo
🌐 https://find-ambulances-and-doctor-client.onrender.com/

### Demo Video
🎥 https://www.awesomescreenshot.com/video/54961795?key=24d4719bc0ee1bcd4cc70462a7216f55

</div>

---

## 📖 Overview

Find Nearby Ambulances & Doctors is a full-stack CRUD application that allows users to manage ambulance services and doctors through an intuitive interface.

The application supports creating, updating, deleting, searching, and viewing healthcare service providers with server-side pagination, loading states, error handling, and responsive design.

---

## ✨ Features

### Frontend

- ✅ View Ambulances & Doctors
- ✅ Create New Record
- ✅ Edit Existing Record
- ✅ Delete Record
- ✅ Server-side Pagination
- ✅ Total Records Counter
- ✅ Responsive Design
- ✅ Loading State
- ✅ Empty State
- ✅ Error State
- ✅ Form Validation
- ✅ Toast Notifications
- ✅ Modern UI

### Backend

- ✅ RESTful API
- ✅ CRUD Operations
- ✅ SQLite Database
- ✅ Pagination
- ✅ Input Validation
- ✅ Error Handling
- ✅ Modular Architecture

---


# 🛠 Tech Stack

## Frontend

- React
- TypeScript
- Vite
- Zod
- Styled Components
- React Router
- Jest
- React Testing Library

## Backend

- Node.js
- Express.js
- TypeScript
- SQLite
- Jest

---

# 📁 Project Structure

```
root/
├── client/          # React 19 + TypeScript + Vite + styled-components
│   └── src/
│       ├── api/             # API client (fetch wrapper)
│       ├── components/ui/   # Reusable UI atoms (Button, Modal, Card, etc.)
│       ├── components/layout/ # Header, Container
│       ├── features/services/ # Feature components + hooks
│       ├── hooks/           # Shared hooks (useDebounce)
│       ├── styles/          # Theme tokens + GlobalStyles
│       └── types/           # TypeScript interfaces
├── server/          # Express 4 + TypeScript + sql.js (SQLite)
│   └── src/
│       ├── config/          # Database initialization
│       ├── controllers/     # Route handlers
│       ├── middleware/       # Error handler, validation
│       ├── models/          # Service interface
│       ├── routes/          # Express router
│       ├── services/        # Business logic (DB queries)
│       ├── seed/            # Seed data (18 records)
│       ├── types/           # Custom type declarations
│       ├── validation/      # Zod schemas
│       └── __tests__/       # Integration tests
└── docs/            # AI_USAGE.md, DECISIONS.md
```

---

# 🚀 Getting Started

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



# 🗄 Database Schema

| Field | Type |
|----------|---------|
| id | Integer |
| type | Ambulance / Doctor |
| title | String |
| description | String |
| location | String |
| image | String |
| createdAt | Date |

---

# 🧪 Running Tests

```bash
# Backend integration tests
npm test --workspace=server

# Frontend component tests
npm test --workspace=client
```

---


# 🌍 Deployment

| Service | URL |
|----------|-----|
| **Frontend** | https://find-ambulances-and-doctor-client.onrender.com/ |
| **Backend API** | https://find-ambulances-and-doctor.onrender.com/api/health |
| **Demo Video** | https://www.awesomescreenshot.com/video/54961795?key=24d4719bc0ee1bcd4cc70462a7216f55 |

---

# 🎯 Assignment Requirements Covered

- ✅ CRUD Operations
- ✅ Pagination (10 Records)
- ✅ Total Records
- ✅ Loading State
- ✅ Error State
- ✅ Empty State
- ✅ Image Support
- ✅ Functional Components
- ✅ TypeScript
- ✅ REST API
- ✅ Jest Testing
- ✅ ESLint

---

# 💡 Future Improvements

- Authentication
- User Roles
- Google Maps Integration
- Geolocation Support
- Image Upload
- Search & Filters
- Docker Support
- CI/CD Pipeline
- Dark Mode
- PWA Support

---

## 🤖 AI Usage

See [docs/AI_USAGE.md](docs/AI_USAGE.md)

---

# 👨‍💻 Author

**Burhanuddin Sarangpurwala**

- GitHub: https://github.com/burhan5246

---

<div align="center">

⭐ If you found this project useful, consider giving it a star!

</div>