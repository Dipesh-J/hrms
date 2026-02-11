# HRMS Lite

A lightweight Human Resource Management System built with **FastAPI**, **MongoDB**, and **React**.

## Tech Stack

- **Frontend**: React (Vite), Plain CSS (Modular & Variables)
- **Backend**: FastAPI, Python
- **Database**: MongoDB (Motor Async Driver)

## Project Structure

```
hrms/
├── server/      # FastAPI Backend
│   ├── app/     # Application source code
│   └── ...
├── client/      # React Frontend
│   ├── src/     # Source code
│   └── ...
└── ...
```

## Setup Instructions

### Prerequisites
- Python 3.8+
- Node.js 16+
- MongoDB (running locally on default port 27017)

### 1. Backend Setup

```bash
cd server
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt

# Create .env file if not exists (default provided in repo)
# MONGO_URL=mongodb://localhost:27017
# DB_NAME=hrms_lite

# Run Server
uvicorn app.main:app --reload
```

Server will start at `http://localhost:8000`. API Docs at `http://localhost:8000/docs`.

### 2. Frontend Setup

```bash
cd client
npm install

# Run Development Server
npm run dev
```

Client will start at `http://localhost:5173`.

## Features

- **Employee Management**: Add, View, and Delete employees.
- **Attendance Management**: Mark daily attendance and view individual records.
- **Dashboard**: Quick overview of employee count.
- **Responsive Design**: Clean, professional UI.

## Configuration

### Environment Variables

#### Backend (`server/.env`)
| Variable | Description | Example |
|----------|-------------|---------|
| `MONGO_URL` | MongoDB Connection String | `mongodb+srv://user:pass@cluster.mongodb.net` |
| `DB_NAME` | Database Name | `hrms_lite` |
| `CORS_ORIGINS` | Allowed Frontend URLs (comma-separated) | `https://your-app.vercel.app,http://localhost:5173` |

#### Frontend (`client/.env`)
| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_API_URL` | Backend API Base URL | `https://your-api.railway.app/api` |

## Deployment

### Backend (Railway)
1. Fork/Push this repo to GitHub.
2. Create a new project on [Railway](https://railway.app/).
3. Select "Deploy from GitHub repo".
4. **Settings** -> **Root Directory**: Set to `/server`.
5. **Variables**: Add `MONGO_URL`, `DB_NAME`, `CORS_ORIGINS`.
6. Use the generated domain as your API URL.

### Frontend (Vercel)
1. Create a new project on [Vercel](https://vercel.com/).
2. Import your GitHub repo.
3. **Build Settings** -> **Root Directory**: Select `client`.
4. **Environment Variables**: Add `VITE_API_URL` (Points to Railway URL).
5. Deploy.

## Assumptions
- Single admin user (No authentication implemented as per requirements).
- Attendance is marked once per day per employee.
