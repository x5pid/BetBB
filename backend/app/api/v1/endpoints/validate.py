import re
from fastapi import APIRouter,Depends
from app.crud.exceptions import ValidationError
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.db.models.user import User
from app.schemas.validate import EmailInput, PasswordInput, UsernameInput

router = APIRouter()

@router.post("/validate/email")
def validate_email(data: EmailInput, db: Session = Depends(get_db)):
    email_normalized = data.email.lower()

    # Vérifie domaine interdit
    forbidden_domains = ["example.com", "tempmail.com"]
    domain = email_normalized.split("@")[-1]
    if domain in forbidden_domains:
        raise ValidationError(
            field="email",
            message="This email domain is not allowed."
        )

    # Vérifie s'il existe déjà en BDD
    user = db.query(User).filter(User.email == email_normalized).first()
    if user:
        raise ValidationError(
            field="email",
            message="This email is already registered."
        )

    return {"valid": True}

@router.post("/validate/username")
def validate_username(data: UsernameInput, db: Session = Depends(get_db)):
    username = data.username
    user_regex = re.compile(r"^[a-zA-Z0-9]+(-[a-zA-Z0-9]+)*$")

    # Vérifie le format
    if not user_regex.fullmatch(username):
        raise ValidationError(
            field="username",
            message="Username may only contain letters, numbers, and single hyphens, and cannot begin or end with a hyphen."
        )
    # Vérifie unicité en BDD
    user = db.query(User).filter(User.username == username).first()
    if user:
        raise ValidationError(
            field="username",
            message="This username is already taken."
        )

    return {"valid": True}

@router.post("/validate/password")
def validate_password(data: PasswordInput):

    password = data.password
    # Condition 1 : au moins 15 caractères
    if len(password) >= 15:
        return {"valid": True}
    # Condition 2 : au moins 8 caractères + 1 chiffre + 1 minuscule
    if (
        len(password) >= 8 and
        re.search(r"[0-9]", password) and
        re.search(r"[a-z]", password)
    ):
        return {"valid": True}

    # Sinon => invalide
    raise ValidationError(
        field="password",
        message="Password is too short"
    )