from fastapi import APIRouter
from typing import List
from app.db.models.objetsymbolique import SymbolicObjectEnum

router = APIRouter()

# Endpoint pour obtenir la liste des objets symboliques
@router.get("/symbolic-objects", response_model=List[SymbolicObjectEnum])
async def get_symbolic_objects():
    return [SymbolicObjectEnum.couche, SymbolicObjectEnum.peluche, SymbolicObjectEnum.tetine, SymbolicObjectEnum.jouet]
