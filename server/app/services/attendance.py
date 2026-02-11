from app.database import db
from app.schemas.attendance import AttendanceCreate, AttendanceResponse
from app.constants import ATTENDANCE_COLLECTION, EMPLOYEES_COLLECTION
from fastapi import HTTPException
from datetime import datetime, date, timezone

ACTIVE_FILTER = {"is_deleted": {"$ne": True}}


async def mark_attendance(attendance: AttendanceCreate) -> dict:
    employee = await db.db[EMPLOYEES_COLLECTION].find_one(
        {"employee_id": attendance.employee_id, **ACTIVE_FILTER}
    )
    if not employee:
        raise HTTPException(status_code=404, detail="Employee not found")

    attendance_date = datetime.combine(attendance.date, datetime.min.time())

    existing_record = await db.db[ATTENDANCE_COLLECTION].find_one({
        "employee_id": attendance.employee_id,
        "date": attendance_date
    })

    if existing_record:
        raise HTTPException(status_code=409, detail="Attendance already marked for this date")

    attendance_dict = attendance.model_dump()
    attendance_dict["date"] = attendance_date
    attendance_dict["created_at"] = datetime.now(timezone.utc)

    result = await db.db[ATTENDANCE_COLLECTION].insert_one(attendance_dict)

    created_attendance = await db.db[ATTENDANCE_COLLECTION].find_one({"_id": result.inserted_id})
    created_attendance["_id"] = str(created_attendance["_id"])
    return created_attendance

async def get_attendance(employee_id: str) -> list[dict]:
    employee = await db.db[EMPLOYEES_COLLECTION].find_one(
        {"employee_id": employee_id, **ACTIVE_FILTER}
    )
    if not employee:
        raise HTTPException(status_code=404, detail="Employee not found")

    records = []
    cursor = db.db[ATTENDANCE_COLLECTION].find({"employee_id": employee_id}).sort("date", -1)
    async for document in cursor:
        document["_id"] = str(document["_id"])
        records.append(document)
    return records

async def get_today_summary() -> dict:
    today_start = datetime.combine(date.today(), datetime.min.time())
    today_end = datetime.combine(date.today(), datetime.max.time())

    present_count = await db.db[ATTENDANCE_COLLECTION].count_documents({
        "date": {"$gte": today_start, "$lte": today_end},
        "status": "Present"
    })
    absent_count = await db.db[ATTENDANCE_COLLECTION].count_documents({
        "date": {"$gte": today_start, "$lte": today_end},
        "status": "Absent"
    })

    return {
        "date": str(date.today()),
        "present": present_count,
        "absent": absent_count,
        "total_marked": present_count + absent_count
    }
