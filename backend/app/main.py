from fastapi import FastAPI
from app.api.v1.endpoints import auth
from app.api.v1.endpoints import validate
from app.api.v1.endpoints import bet
from app.api.v1.endpoints import user
from app.db.session import engine, Base
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from fastapi.exceptions import RequestValidationError
from app.crud.exceptions import ValidationError, validation_exception_handler,pydantic_validation_handler


Base.metadata.create_all(bind=engine)

app = FastAPI(title="Angular + FastAPI JWT")

app.add_exception_handler(ValidationError, validation_exception_handler)
app.add_exception_handler(RequestValidationError, pydantic_validation_handler)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.FRONTEND_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/api/v1")
app.include_router(validate.router, prefix="/api/v1")
app.include_router(bet.router, prefix="/api/v1")
app.include_router(user.router, prefix="/api/v1")
