from motor.motor_asyncio import AsyncIOMotorClient
from app.config import settings
from app.constants import EMPLOYEES_COLLECTION, ATTENDANCE_COLLECTION

class Database:
    client: AsyncIOMotorClient = None
    db = None

db = Database()

async def connect_to_mongo():
    db.client = AsyncIOMotorClient(settings.MONGO_URL)
    db.db = db.client[settings.DB_NAME]
    try:
        await db.db[EMPLOYEES_COLLECTION].create_index("employee_id", unique=True)
        await db.db[EMPLOYEES_COLLECTION].create_index("email", unique=True)
        await db.db[ATTENDANCE_COLLECTION].create_index(
            [("employee_id", 1), ("date", 1)],
            unique=True
        )
    except Exception as e:
        print(f"Warning: Could not create indexes: {e}")

async def close_mongo_connection():
    db.client.close()

def get_database():
    return db.db
