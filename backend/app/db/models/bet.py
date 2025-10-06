from app.db.session import Base
from sqlalchemy import Column, Integer, String, Date, Numeric, Enum
from sqlalchemy.orm import declarative_base

from app.db.models.gender import GenderEnum
from app.db.models.objetsymbolique import SymbolicObjectEnum

class Bet(Base):
    __tablename__ = "bet"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, nullable=False)
    date = Column(Date, nullable=False) 
    amount = Column(Numeric(10, 2), nullable=False)   
    gender = Column(Enum(GenderEnum), nullable=False)    
    symbolic_object = Column(Enum(SymbolicObjectEnum), nullable=False)