
# schemas/price_choice.py
from typing import List
from pydantic import BaseModel

class PriceChoiceItem(BaseModel):
    id: int
    code: str
    label: str
    description: str

PRICE_CHOICES : List[PriceChoiceItem] = [
    {"id": 1, "code": "cotisation", "label": "Cotisation", "description": "Montant fixe ajouté à chaque pari."},
    {"id": 2, "code": "percentage", "label": "Pourcentage", "description": "Pourcentage du montant du pari."},
    {"id": 3, "code": "redistribution", "label": "Redistribution des gains", "description": "Le site garde une part des gains."}
]

def get_price_choice_by_id(choice_id: int)-> PriceChoiceItem | None:
    return next((c for c in PRICE_CHOICES if c["id"] == choice_id), None)

def get_price_choice_by_code(code: str)-> PriceChoiceItem | None:
    return next((c for c in PRICE_CHOICES if c["code"] == code), None)

def list_price_choices()-> List[PriceChoiceItem] :
    return PRICE_CHOICES

class PriceChoiceCreate(BaseModel):
    id:int



