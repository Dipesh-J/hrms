from fastapi import APIRouter, status
from app.schemas.attendance import AttendanceCreate, AttendanceResponse
from app.services import attendance as service
from app.constants import ATTENDANCE_ROUTE_PREFIX
from typing import List

router = APIRouter(prefix=ATTENDANCE_ROUTE_PREFIX, tags=["Attendance"])

@router.post("/", response_model=AttendanceResponse, status_code=status.HTTP_201_CREATED)
async def mark_attendance(attendance: AttendanceCreate):
    return await service.mark_attendance(attendance)

@router.get("/summary/today")
async def get_today_summary():
    return await service.get_today_summary()

@router.get("/{employee_id}", response_model=List[AttendanceResponse])
async def get_employee_attendance(employee_id: str):
    return await service.get_attendance(employee_id)
