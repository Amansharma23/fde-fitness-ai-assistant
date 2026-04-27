from database import SessionLocal, engine
import models
from seed_data import seed_mock_data

models.Base.metadata.create_all(bind=engine)
db = SessionLocal()
try:
    seed_mock_data(db)
finally:
    db.close()

print("Done seeding users and activities.")
