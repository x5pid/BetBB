from fastapi import APIRouter,Depends, HTTPException, Response
from sqlalchemy.orm import Session
from app.db.session import get_db
from typing import List

from app.db.models.user import User
from app.core.bet import get_current_user
from app.schemas.price_choice import PriceChoiceCreate, PriceChoiceItem, get_price_choice_by_id, list_price_choices
from app.db.models.price_choice import PriceChoice
from sqlalchemy import exc

router = APIRouter()
    
@router.get("/price-choices", response_model=List[PriceChoiceItem])
async def price_choices():
    return list_price_choices()

@router.post("/price-choices/me", response_model=PriceChoiceItem)
async def create_bet(choice: PriceChoiceCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    try:
        new_price_choise = PriceChoice (
            user_id=current_user.id,
            id=choice.id,
        )

        db.add(new_price_choise)
        db.commit()
        db.refresh(new_price_choise)

        return get_price_choice_by_id(new_price_choise.id)

    except exc.SQLAlchemyError as e:
        db.rollback()
        raise HTTPException(status_code=500, detail="Database Error: Unable to add price choice")

@router.get("/price-choices/me", response_model=PriceChoiceItem)
async def get_user_price_choice(db: Session = Depends(get_db),current_user: User = Depends(get_current_user)):
    price_choice = db.query(PriceChoice).filter(PriceChoice.user_id == current_user.id).first()
    return get_price_choice_by_id(price_choice.id)

@router.delete("/price-choices/{user_id}", status_code=204)
async def delete_user(user_id: int, db: Session = Depends(get_db)):
    price_choice = db.query(PriceChoice).filter(PriceChoice.user_id == user_id).first()

    if not price_choice:
        raise HTTPException(status_code=404, detail="Price choice not found")
    db.delete(price_choice)
    db.commit()

    return Response(status_code=204)
