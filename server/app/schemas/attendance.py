from pydantic import BaseModel, Field
from datetime import date, datetime
from enum import Enum

class AttendanceStatus(str, Enum):
    PRESENT = "Present"
    ABSENT = "Absent"

class AttendanceBase(BaseModel):
    employee_id: str = Field(...)
    date: date
    status: AttendanceStatus

class AttendanceCreate(AttendanceBase):
    pass

class AttendanceResponse(AttendanceBase):
    id: str = Field(..., alias="_id")
    created_at: datetime
    
    class Config:
        populate_by_name = True
        json_schema_extra = {
            "example": {
                "_id": "60d5ec49f1a4c80015f6b3e2",
                "employee_id": "EMP001",
                "date": "2023-10-27",
                "status": "Present",
                "created_at": "2023-10-27T09:00:00"
            }
        }
