from pydantic import BaseModel
from pydantic import BaseModel, field_validator
from app.crud.exceptions import ValidationError

class EmailInput(BaseModel):
    email: str

    @field_validator('email')
    def simple_email_format(cls, v):
        # ex: doit contenir '@' et un point après le @
        if '@' not in v or '.' not in v.split('@')[-1]:
            raise ValidationError(field="email",message="Email is invalide")
        return v

class UsernameInput(BaseModel):
    username: str

class PasswordInput(BaseModel):
    password: str
