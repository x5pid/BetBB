from fastapi import APIRouter,Depends, HTTPException, Response
from sqlalchemy.orm import Session
from app.db.session import get_db
from typing import List

from app.schemas.user import UserReponse
from app.db.models.user import User
from app.db.models.bet import Bet

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

@router.delete("/user/{user_id}", status_code=204)
async def delete_user(user_id: int, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()

    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    #Supprimer les bets associés
    db.query(Bet).filter(Bet.user_id == user_id).delete(synchronize_session=False)

    db.delete(user)
    db.commit()

    return Response(status_code=204)
