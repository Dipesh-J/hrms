from fastapi import APIRouter, status
from app.schemas.employee import EmployeeCreate, EmployeeResponse
from app.services import employee as service
from app.constants import EMPLOYEES_ROUTE_PREFIX

router = APIRouter(prefix=EMPLOYEES_ROUTE_PREFIX, tags=["Employees"])

@router.post("/", response_model=EmployeeResponse, status_code=status.HTTP_201_CREATED)
async def create_employee(employee: EmployeeCreate):
    return await service.create_employee(employee)

@router.get("/", response_model=list[EmployeeResponse])
async def list_employees():
    return await service.get_employees()

@router.get("/{id}", response_model=EmployeeResponse)
async def get_employee(id: str):
    return await service.get_employee(id)

@router.delete("/{id}", status_code=status.HTTP_200_OK)
async def delete_employee(id: str):
    return await service.delete_employee(id)
