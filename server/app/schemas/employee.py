from pydantic import BaseModel, EmailStr, Field
from datetime import datetime
from typing import Optional

class EmployeeBase(BaseModel):
    employee_id: str = Field(...)
    full_name: str = Field(..., min_length=2, max_length=100)
    email: EmailStr
    department: str = Field(..., min_length=2, max_length=100)

class EmployeeCreateRequest(BaseModel):
    full_name: str = Field(..., min_length=2, max_length=100)
    email: EmailStr
    department: str = Field(..., min_length=2, max_length=100)

class EmployeeCreate(EmployeeBase):
    pass

class EmployeeUpdate(BaseModel):
    full_name: Optional[str] = None
    email: Optional[EmailStr] = None
    department: Optional[str] = None

class EmployeeResponse(EmployeeBase):
    id: str = Field(..., alias="_id")
    full_name: str = Field(..., alias="name")
    is_deleted: bool = False
    created_at: datetime

    class Config:
        populate_by_name = True
        json_schema_extra = {
            "example": {
                "_id": "60d5ec49f1a4c80015f6b3e1",
                "employee_id": "EMP001",
                "full_name": "John Doe",
                "email": "john@example.com",
                "department": "Engineering",
                "created_at": "2023-01-01T12:00:00"
            }
        }
