from pydantic import BaseModel

class UserReponse(BaseModel):
    id: int
    email: str
    username: str