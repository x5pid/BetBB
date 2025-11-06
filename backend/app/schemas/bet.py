from typing import List, Optional
from pydantic import BaseModel

from app.db.models.gender import GenderEnum
from app.db.models.objetsymbolique import SymbolicObjectEnum
from datetime import datetime

class BetCreate(BaseModel):
    amount: float
    gender: GenderEnum
    symbolic_object: SymbolicObjectEnum

# Schema for responding with a bet (excluding user_id and id)
class BetResponse(BaseModel):
    datetime: datetime
    amount: float
    gender: GenderEnum
    symbolic_object: SymbolicObjectEnum

class BetUserResponse(BaseModel):
    amount: float
    gender: Optional[GenderEnum]

class OddsSnapshot(BaseModel):
    datetime: datetime
    boy_odds: float
    girl_odds: float

class BetDistribution(BaseModel):
    percentage: float
    gender: GenderEnum

class BetStatResponse(BaseModel):
    boy_odds: float
    girl_odds: float
    total_bets: float
    boy_total: float
    girl_total: float
    distribution: List[BetDistribution]
    last_bet: Optional[BetUserResponse]
    odds_history: List[OddsSnapshot]  
