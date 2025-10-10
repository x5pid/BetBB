from sqlite3 import IntegrityError
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session

from app.core.security import verify_password, create_access_token, get_password_hash, create_refresh_token, refresh_access_token
from app.db.session import get_db
from app.schemas.token import TokenResponse
from app.db.models.user import User
from app.crud.schemas import RegisterUser
from fastapi import Body
from fastapi import Response
from fastapi import Request

from app.services.validation import validate_email_logic, validate_password_logic, validate_username_logic
from app.crud.exceptions import ValidationError

router = APIRouter()

@router.post("/register", status_code=status.HTTP_201_CREATED)
def register(user_data: RegisterUser, db: Session = Depends(get_db)):

    #Vérification
    validate_email_logic(user_data.email,db)
    validate_password_logic(user_data.password)
    validate_username_logic(user_data.username,db)
    
    hashed = get_password_hash(user_data.password)
    new_user = User(
        email=user_data.email,
        hashed_password=hashed,
        username=user_data.username
    )
    
    try:
        db.add(new_user)
        db.commit()
        db.refresh(new_user)
    except IntegrityError:
        db.rollback()
        raise HTTPException(status_code=400, detail="Email already registered")

    return {"msg": "User created", "user_id": new_user.id}

@router.post("/login", response_model=TokenResponse)
def login(response: Response,form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    
    user = db.query(User).filter(User.email == form_data.username).first()

    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Incorrect username or password.")
        #raise ValidationError(field="login",message="Incorrect username or password.", status_code=status.HTTP_401_UNAUTHORIZED)

    access_token_data = create_access_token({"sub": user.email})
    refresh_token_data = create_refresh_token({"sub": user.email})

    response.set_cookie(
        key="refresh_token",
        value=refresh_token_data["refresh_token"],
        httponly=True,
        secure=True,  # à activer en prod (HTTPS)
        samesite="Strict",
        max_age=refresh_token_data["expires_in"]
    )

    return {
        "access_token": access_token_data["access_token"],
        "token_type": "bearer",
        "expires_in": access_token_data["expires_in"]
    }

@router.post("/token")
def refresh_token_from_cookie(request: Request):
    refresh_token = request.cookies.get("refresh_token")
    if not refresh_token:
        raise HTTPException(status_code=401, detail="Missing refresh token")

    try:
        new_token_data = refresh_access_token(refresh_token)
    except ValueError:
        raise HTTPException(status_code=401, detail="Invalid refresh token")

    return new_token_data
