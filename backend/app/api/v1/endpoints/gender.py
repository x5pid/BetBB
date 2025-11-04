from fastapi import APIRouter
from typing import List
from app.db.models.gender import GenderEnum

router = APIRouter()

@router.get("/genres", response_model=List[GenderEnum])
async def get_genres():
    return [GenderEnum.girl, GenderEnum.boy]
