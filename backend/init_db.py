from database import engine, SessionLocal
import models
from seed_data import seed_mock_data

def init_db():
    print("Creating database tables...")
    models.Base.metadata.create_all(bind=engine)

    db = SessionLocal()
    try:
        print("Seeding mock users and activities...")
        seed_mock_data(db)
    finally:
        db.close()

    print("Database initialization complete.")

if __name__ == "__main__":
    init_db()
