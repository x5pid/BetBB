from fastapi import APIRouter,Depends, HTTPException
from sqlalchemy.orm import Session
from app.db.session import get_db
from typing import List
from datetime import date, datetime, time
from sqlalchemy import exc

from app.db.models.bet import Bet
from app.schemas.bet import BetCreate, BetResponse
from app.db.models.user import User
from app.core.bet import get_current_user
from app.schemas.bet import BetStatResponse, BetUserResponse, BetDistribution, OddsSnapshot
from sqlalchemy import func
from app.db.models.gender import GenderEnum
from datetime import timezone

router = APIRouter()

# 1. Add a new Bet
@router.post("/bets/me", response_model=BetResponse)
async def create_bet(bet: BetCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    try:
        new_bet = Bet(
            user_id=current_user.id,
            date=datetime.now(timezone.utc),
            amount=bet.amount,
            gender=bet.gender,
            symbolic_object=bet.symbolic_object
        )

        db.add(new_bet)
        db.commit()
        db.refresh(new_bet)

        return {
            "datetime": new_bet.date if isinstance(new_bet.date, datetime) else datetime.combine(new_bet.date, time.min),
            "amount": new_bet.amount,
            "gender": new_bet.gender,
            "symbolic_object": new_bet.symbolic_object
        }

    except exc.SQLAlchemyError as e:
        db.rollback()
        raise HTTPException(status_code=500, detail="Database Error: Unable to add bet")

# 2. Get a list of all bets excluding user_id and id
@router.get("/bets", response_model=List[BetResponse])
async def get_all_bets(db: Session = Depends(get_db)):
    bets = db.query(Bet).all()

    # Exclude user_id and id from the response
    response = [
        {
            "datetime": bet.date if isinstance(bet.date, datetime) else datetime.combine(bet.date, time.min),
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
            "datetime": bet.date if isinstance(bet.date, datetime) else datetime.combine(bet.date, time.min),
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
        "datetime": bet.date if isinstance(bet.date, datetime) else datetime.combine(bet.date, time.min),
        "amount": bet.amount,
        "gender": bet.gender,
        "symbolic_object": bet.symbolic_object
    }

@router.get("/bets/stats", response_model=BetStatResponse)
async def get_bets_stats(db: Session = Depends(get_db)):
    # Get all bets
    bets = db.query(Bet).all()
    if not bets:
        # Si aucun bet, retourne des valeurs par défaut
        return BetStatResponse(
            boy_odds=1.0,
            girl_odds=1.0,
            total_bets=0,
            boy_total=0,
            girl_total=0,
            distribution=[],
            last_bet=None,
            odds_history=[]
        )

    boy_bets = [bet for bet in bets if bet.gender == GenderEnum.boy]
    girl_bets = [bet for bet in bets if bet.gender == GenderEnum.girl]
    print(boy_bets)
    print(girl_bets)
    boy_total = sum(bet.amount for bet in boy_bets)
    girl_total = sum(bet.amount for bet in girl_bets)
    total_bets = boy_total + girl_total

    # odds: proportional, avoid division by zero
    if boy_total > 0 and girl_total > 0:
        boy_odds = total_bets / boy_total
        girl_odds = total_bets / girl_total
    else:
        boy_odds = 1.0
        girl_odds = 1.0

    # Distribution by gender
    distribution = []
    if total_bets > 0:
        if boy_total > 0:
            distribution.append(BetDistribution(percentage=boy_total/total_bets*100, gender=GenderEnum.boy))
        if girl_total > 0:
            distribution.append(BetDistribution(percentage=girl_total/total_bets*100, gender=GenderEnum.girl))

    # Last bet
    last_bet = bets[-1]
    last_bet_resp = BetUserResponse(
        amount=last_bet.amount,
        gender=last_bet.gender
    )

    # Odds history by date
    odds_history = []
    date_groups = {}
    for bet in bets:
        dt = bet.date
        date_groups.setdefault(dt, []).append(bet)
    for dt in sorted(date_groups):
        daily_bets = date_groups[dt]
        daily_boy_total = sum(b.amount for b in daily_bets if b.gender == GenderEnum.boy)
        daily_girl_total = sum(b.amount for b in daily_bets if b.gender == GenderEnum.girl)
        daily_total = daily_boy_total + daily_girl_total
        if daily_boy_total > 0 and daily_girl_total > 0:
            boy_odds_day = daily_total / daily_boy_total
            girl_odds_day = daily_total / daily_girl_total
        else:
            boy_odds_day = 1.0
            girl_odds_day = 1.0
        odds_history.append(
            OddsSnapshot(
                datetime=dt if isinstance(dt, datetime) else datetime.combine(dt, time.min),
                boy_odds=boy_odds_day,
                girl_odds=girl_odds_day
            )
        )

    return BetStatResponse(
        boy_odds=boy_odds,
        girl_odds=girl_odds,
        total_bets=total_bets,
        boy_total=boy_total,
        girl_total=girl_total,
        distribution=distribution,
        last_bet=last_bet_resp,
        odds_history=odds_history
    )

@router.get("/bets/user", response_model=BetUserResponse)
async def get_user_bet_stats(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    user_bets = db.query(Bet).filter(Bet.user_id == current_user.id).all()
    if not user_bets:
        # Return default if no user bets
        return BetUserResponse(
            amount=0,
            gender=None,
        )
    total_amount = sum(bet.amount for bet in user_bets)
    # Suppose "gender" can be majority or the last one
    last_gender = user_bets[-1].gender

    return BetUserResponse(
        amount=total_amount,
        gender=last_gender
    )
