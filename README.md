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

## Deployment Notes

- **Frontend**: Deploy `client/dist` to Netlify/Vercel.
- **Backend**: Deploy `server` to Render/Railway.
- **Database**: Use MongoDB Atlas and update partial `MONGO_URL` env var.

## Assumptions
- Single admin user (No authentication implemented as per requirements).
- Attendance is marked once per day per employee.
