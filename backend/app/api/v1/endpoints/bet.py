from fastapi import APIRouter,Depends, HTTPException
from sqlalchemy.orm import Session
from app.db.session import get_db
from typing import List
from datetime import date
from sqlalchemy import exc

from app.db.models.bet import Bet
from app.schemas.bet import BetCreate, BetResponse
from app.db.models.user import User
from app.core.bet import get_current_user


router = APIRouter()

# 1. Add a new Bet
@router.post("/bets/", response_model=BetResponse)
async def create_bet(bet: BetCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    try:
        new_bet = Bet(
            user_id=current_user.id,
            date=date.today(),
            amount=bet.amount,
            gender=bet.gender,
            symbolic_object=bet.symbolic_object
        )

        db.add(new_bet)
        db.commit()
        db.refresh(new_bet)

        return new_bet

    except exc.SQLAlchemyError as e:
        db.rollback()
        raise HTTPException(status_code=500, detail="Database Error: Unable to add bet")

# 2. Get a list of all bets excluding user_id and id
@router.get("/bets/", response_model=List[BetResponse])
async def get_all_bets(db: Session = Depends(get_db)):
    bets = db.query(Bet).all()

    # Exclude user_id and id from the response
    response = [
        {
            "date": bet.date,
            "amount": bet.amount,
            "gender": bet.gender,
            "symbolic_object": bet.symbolic_object
        }
        for bet in bets
    ]
    return response

# 3. Get all bets for a specific user
@router.get("/bets/me", response_model=List[BetResponse])
async def get_user_bets(db: Session = Depends(get_db),current_user: User = Depends(get_current_user)):
    bets = db.query(Bet).filter(Bet.user_id == current_user.id).all()

    return [
        {
            "date": bet.date,
            "amount": bet.amount,
            "gender": bet.gender,
            "symbolic_object": bet.symbolic_object
        }
        for bet in bets
    ]

# 4. Delete a bet by its ID
@router.delete("/bets/{bet_id}", response_model=BetResponse)
async def delete_bet(bet_id: int, db: Session = Depends(get_db)):
    bet = db.query(Bet).filter(Bet.id == bet_id).first()

    if not bet:
        raise HTTPException(status_code=404, detail="Bet not found")

    db.delete(bet)
    db.commit()

    return {
        "date": bet.date,
        "amount": bet.amount,
        "gender": bet.gender,
        "symbolic_object": bet.symbolic_object
    }

