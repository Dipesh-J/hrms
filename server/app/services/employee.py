from app.database import db
from app.schemas.employee import EmployeeCreate, EmployeeResponse
from app.constants import EMPLOYEES_COLLECTION
from fastapi import HTTPException
from datetime import datetime, timezone
from bson import ObjectId

async def create_employee(employee: EmployeeCreate) -> dict:
    existing_employee = await db.db[EMPLOYEES_COLLECTION].find_one({"employee_id": employee.employee_id})
    if existing_employee:
        raise HTTPException(status_code=400, detail="Employee ID already exists")

    existing_email = await db.db[EMPLOYEES_COLLECTION].find_one({"email": employee.email})
    if existing_email:
        raise HTTPException(status_code=400, detail="Email already exists")

    employee_dict = employee.model_dump()
    employee_dict["created_at"] = datetime.now(timezone.utc)

    result = await db.db[EMPLOYEES_COLLECTION].insert_one(employee_dict)

    created_employee = await db.db[EMPLOYEES_COLLECTION].find_one({"_id": result.inserted_id})
    created_employee["_id"] = str(created_employee["_id"])
    return created_employee

async def get_employees() -> list[dict]:
    employees = []
    cursor = db.db[EMPLOYEES_COLLECTION].find({})
    async for document in cursor:
        document["_id"] = str(document["_id"])
        employees.append(document)
    return employees

async def get_employee(employee_id_or_id: str) -> dict:
    employee = await db.db[EMPLOYEES_COLLECTION].find_one({"employee_id": employee_id_or_id})

    if not employee and ObjectId.is_valid(employee_id_or_id):
        employee = await db.db[EMPLOYEES_COLLECTION].find_one({"_id": ObjectId(employee_id_or_id)})

    if not employee:
        raise HTTPException(status_code=404, detail="Employee not found")

    employee["_id"] = str(employee["_id"])
    return employee

async def delete_employee(employee_id_or_id: str):
    query = {"employee_id": employee_id_or_id}
    if ObjectId.is_valid(employee_id_or_id) and not await db.db[EMPLOYEES_COLLECTION].find_one(query):
        query = {"_id": ObjectId(employee_id_or_id)}

    result = await db.db[EMPLOYEES_COLLECTION].delete_one(query)

    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Employee not found")

    return {"message": "Employee deleted successfully"}
