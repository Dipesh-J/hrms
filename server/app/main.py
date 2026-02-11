import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import employee, attendance
from contextlib import asynccontextmanager
from app.database import close_mongo_connection, connect_to_mongo
from app.config import settings

@asynccontextmanager
async def lifespan(app: FastAPI):
    await connect_to_mongo()
    yield
    await close_mongo_connection()

app = FastAPI(title="HRMS Lite API", lifespan=lifespan)

origins = settings.CORS_ORIGINS.split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(employee.router)
app.include_router(attendance.router)

@app.get("/")
async def root():
    return {"message": "Welcome to HRMS Lite API"}
