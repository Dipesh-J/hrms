from fastapi import APIRouter, status
from app.schemas.employee import EmployeeCreateRequest, EmployeeResponse
from app.services import employee as service
from app.constants import EMPLOYEES_ROUTE_PREFIX

router = APIRouter(prefix=EMPLOYEES_ROUTE_PREFIX, tags=["Employees"])

@router.get("/next-id")
async def get_next_employee_id():
    next_id = await service.get_next_employee_id()
    return {"next_employee_id": next_id}

@router.post("/", response_model=EmployeeResponse, status_code=status.HTTP_201_CREATED)
async def create_employee(employee: EmployeeCreateRequest):
    return await service.create_employee(employee)

@router.get("/", response_model=list[EmployeeResponse])
async def list_employees(show_deleted: bool = False):
    return await service.get_employees(show_deleted)

@router.get("/{id}", response_model=EmployeeResponse)
async def get_employee(id: str):
    return await service.get_employee(id)

@router.delete("/{id}", status_code=status.HTTP_200_OK)
async def delete_employee(id: str):
    return await service.delete_employee(id)
