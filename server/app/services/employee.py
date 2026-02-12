from app.database import db
from app.schemas.employee import EmployeeCreateRequest, EmployeeResponse
from app.constants import EMPLOYEES_COLLECTION, EMPLOYEE_ID_PREFIX, EMPLOYEE_ID_PAD_WIDTH
from fastapi import HTTPException
from datetime import datetime, timezone
from bson import ObjectId
from pymongo import ReturnDocument
from pymongo.errors import DuplicateKeyError


ACTIVE_FILTER = {"is_deleted": {"$ne": True}}


async def sync_employee_counter():
    """Sync counter with highest existing employee ID to prevent skips"""
    try:
        # Find highest existing employee ID number
        pipeline = [
            {"$match": {"employee_id": {"$regex": "^EMP\\d+$"}}},
            {"$addFields": {"num": {"$toInt": {"$substr": ["$employee_id", 3, -1]}}}},
            {"$sort": {"num": -1}},
            {"$limit": 1}
        ]
        result = await db.db[EMPLOYEES_COLLECTION].aggregate(pipeline).to_list(length=1)
        
        if result:
            highest_num = result[0]["num"]
            # Update counter to be at least as high as the highest existing ID
            await db.db["counters"].update_one(
                {"_id": "employee_id"},
                {"$max": {"seq": highest_num}},
                upsert=True
            )
    except Exception:
        pass  # Don't fail if counter sync fails


async def get_next_employee_id() -> str:
    counter = await db.db["counters"].find_one_and_update(
        {"_id": "employee_id"},
        {"$inc": {"seq": 1}},
        upsert=True,
        return_document=ReturnDocument.AFTER
    )
    next_num = counter["seq"]
    return f"{EMPLOYEE_ID_PREFIX}{str(next_num).zfill(EMPLOYEE_ID_PAD_WIDTH)}"


async def create_employee(employee: EmployeeCreateRequest) -> dict:
    existing_email = await db.db[EMPLOYEES_COLLECTION].find_one(
        {"email": employee.email, **ACTIVE_FILTER}
    )
    if existing_email:
        raise HTTPException(status_code=400, detail="Email already exists")

    employee_dict = employee.model_dump()
    employee_dict["is_deleted"] = False
    employee_dict["created_at"] = datetime.now(timezone.utc)

    # Sync counter with highest existing ID to prevent gaps
    await sync_employee_counter()

    max_retries = 5
    for attempt in range(max_retries):
        employee_id = await get_next_employee_id()
        
        # Check if this ID already exists before trying to insert
        existing = await db.db[EMPLOYEES_COLLECTION].find_one({"employee_id": employee_id})
        if existing:
            # ID already exists, skip to next iteration to get a new ID
            if attempt == max_retries - 1:
                raise HTTPException(status_code=500, detail="Failed to generate unique employee ID after multiple retries") from None
            continue
            
        employee_dict["employee_id"] = employee_id

        try:
            result = await db.db[EMPLOYEES_COLLECTION].insert_one(employee_dict)
            break
        except DuplicateKeyError as e:
            if "employee_id" in str(e) or "employee_id_1" in str(e):
                if attempt == max_retries - 1:
                    raise HTTPException(status_code=500, detail="Failed to generate unique employee ID after multiple retries") from None
                continue
            else:
                # Likely email duplication if race condition occurred after initial check
                raise HTTPException(status_code=400, detail="Email already exists") from None

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
