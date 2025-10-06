from pydantic import BaseModel

from app.db.models.gender import GenderEnum
from app.db.models.objetsymbolique import SymbolicObjectEnum
from datetime import date

class BetCreate(BaseModel):
    amount: float
    gender: GenderEnum
    symbolic_object: SymbolicObjectEnum

# Schema for responding with a bet (excluding user_id and id)
class BetResponse(BaseModel):
    date: date
    amount: float
    gender: GenderEnum
    symbolic_object: SymbolicObjectEnum
