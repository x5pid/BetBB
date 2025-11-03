from fastapi import APIRouter,Depends
from sqlalchemy.orm import Session
from app.db.session import get_db
from typing import List

from app.schemas.user import UserReponse
from app.db.models.user import User

router = APIRouter()

# 2. Get a list of all bets excluding user_id and id
@router.get("/users", response_model=List[UserReponse])
async def get_all_users(db: Session = Depends(get_db)):
    users = db.query(User).all()

    # Exclude user_id and id from the response
    response = [
        {
            "id": user.id,
            "email": user.email,
            "username": user.username,
        }
        for user in users
    ]
    return response