from sqlite3 import IntegrityError
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session

from app.core.security import (
    verify_password,
    create_access_token,
    get_password_hash,
    create_refresh_token,
    refresh_access_token,
    create_password_reset_token,
    verify_password_reset_token,
)
from app.db.session import get_db
from app.schemas.token import TokenResponse
from app.schemas.password import ForgotPasswordRequest, ResetPasswordRequest
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

@router.post("/forgot-password")
def forgot_password(payload: ForgotPasswordRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == payload.email).first()
    # Always return 200 to avoid account enumeration
    if not user:
        return {"msg": "If the email exists, a reset link has been sent."}

    token_data = create_password_reset_token({"sub": user.email})

    # TODO: integrate an email service. For now, return the token for testing.
    # In production, remove the token from the response and send via email.
    return {
        "msg": "Reset link sent",
        "reset_token": token_data["reset_token"],
        "expires_in": token_data["expires_in"],
    }

@router.post("/reset-password")
def reset_password(payload: ResetPasswordRequest, db: Session = Depends(get_db)):
    try:
        email = verify_password_reset_token(payload.token)
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid or expired reset token")

    user = db.query(User).filter(User.email == email).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    user.hashed_password = get_password_hash(payload.new_password)
    db.add(user)
    db.commit()

    return {"msg": "Password updated successfully"}

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
