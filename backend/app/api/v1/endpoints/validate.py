import re
from fastapi import APIRouter,Depends
from app.crud.exceptions import ValidationError
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.db.models.user import User
from app.schemas.validate import EmailInput, PasswordInput, UsernameInput
from app.services.validation import validate_email_logic, validate_password_logic, validate_username_logic

router = APIRouter()

@router.post("/validate/email")
def validate_email(data: EmailInput, db: Session = Depends(get_db)):
    validate_email_logic(data.email, db)
    return {"valid": True}

@router.post("/validate/username")
def validate_username(data: UsernameInput, db: Session = Depends(get_db)):
    validate_username_logic(data.username ,db)
    return {"valid": True}

@router.post("/validate/password")
def validate_password_route(data: PasswordInput):
    return validate_password_logic(data.password)
    