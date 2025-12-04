
from unittest.mock import Base
from sqlalchemy import Column, Integer

class PriceChoice(Base):
    __tablename__ = "pricechoice"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, nullable=False)
