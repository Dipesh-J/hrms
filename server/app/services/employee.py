from app.database import db
from app.schemas.employee import EmployeeCreateRequest, EmployeeResponse
from app.constants import EMPLOYEES_COLLECTION, EMPLOYEE_ID_PREFIX, EMPLOYEE_ID_PAD_WIDTH
from fastapi import HTTPException
from datetime import datetime, timezone
from bson import ObjectId
import re

ACTIVE_FILTER = {"is_deleted": {"$ne": True}}


async def get_next_employee_id() -> str:
    cursor = db.db[EMPLOYEES_COLLECTION].find({}, {"employee_id": 1})
    max_num = 0
    async for doc in cursor:
        match = re.search(r'\d+$', doc.get("employee_id", ""))
        if match:
            max_num = max(max_num, int(match.group()))
    next_num = max_num + 1
    return f"{EMPLOYEE_ID_PREFIX}{str(next_num).zfill(EMPLOYEE_ID_PAD_WIDTH)}"


async def create_employee(employee: EmployeeCreateRequest) -> dict:
    existing_email = await db.db[EMPLOYEES_COLLECTION].find_one(
        {"email": employee.email, **ACTIVE_FILTER}
    )
    if existing_email:
        raise HTTPException(status_code=400, detail="Email already exists")

    employee_id = await get_next_employee_id()

    employee_dict = employee.model_dump()
    employee_dict["employee_id"] = employee_id
    employee_dict["is_deleted"] = False
    employee_dict["created_at"] = datetime.now(timezone.utc)

    result = await db.db[EMPLOYEES_COLLECTION].insert_one(employee_dict)

    created_employee = await db.db[EMPLOYEES_COLLECTION].find_one({"_id": result.inserted_id})
    created_employee["_id"] = str(created_employee["_id"])
    return created_employee


async def get_employees(show_deleted: bool = False) -> list[dict]:
    employees = []
    filter_query = {} if show_deleted else ACTIVE_FILTER
    cursor = db.db[EMPLOYEES_COLLECTION].find(filter_query)
    async for document in cursor:
        document["_id"] = str(document["_id"])
        employees.append(document)
    return employees


async def get_employee(employee_id_or_id: str) -> dict:
    employee = await db.db[EMPLOYEES_COLLECTION].find_one(
        {"employee_id": employee_id_or_id, **ACTIVE_FILTER}
    )

    if not employee and ObjectId.is_valid(employee_id_or_id):
        employee = await db.db[EMPLOYEES_COLLECTION].find_one(
            {"_id": ObjectId(employee_id_or_id), **ACTIVE_FILTER}
        )

    if not employee:
        raise HTTPException(status_code=404, detail="Employee not found")

    employee["_id"] = str(employee["_id"])
    return employee


async def delete_employee(employee_id_or_id: str):
    query = {"employee_id": employee_id_or_id, **ACTIVE_FILTER}
    if not await db.db[EMPLOYEES_COLLECTION].find_one(query):
        if ObjectId.is_valid(employee_id_or_id):
            query = {"_id": ObjectId(employee_id_or_id), **ACTIVE_FILTER}
        else:
            raise HTTPException(status_code=404, detail="Employee not found")

    result = await db.db[EMPLOYEES_COLLECTION].update_one(
        query,
        {"$set": {"is_deleted": True, "deleted_at": datetime.now(timezone.utc)}}
    )

    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Employee not found")

    return {"message": "Employee deleted successfully"}
