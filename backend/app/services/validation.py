import re
from sqlalchemy.orm import Session
from app.db.models.user import User
from app.crud.exceptions import ValidationError

#region EMAIL

FORBIDDEN_DOMAINS = ["tempmail.com", "mailinator.com"]
# Vérifie domaine interdit
def is_forbidden_email(email: str) -> bool:
    domain = email.split("@")[-1]
    return domain in FORBIDDEN_DOMAINS

#Vérifie si le email existe déjà en BDD
def is_email_taken(email: str, db: Session) -> bool:
    return db.query(User).filter(User.email == email).first() is not None

def validate_email_logic(email: str, db: Session):
    email_normalized = email.lower()

    if is_forbidden_email(email_normalized):
        raise ValidationError(
            field="email",
            message="This email domain is not allowed."
        )

    if is_email_taken(email_normalized, db):
        raise ValidationError(
            field="email",
            message="This email is already registered."
        )
#endregion

#region PASSWORD

#Mot de passe fort : au moins 15 caractères
def is_strong_password(password: str) -> bool:
    return len(password) >= 15

#Mot de passe moyen : au moins 8 caractères, 1 chiffre, 1 minuscule
def is_medium_password(password: str) -> bool:
    return (
        len(password) >= 8 and
        re.search(r"[0-9]", password) and
        re.search(r"[a-z]", password)
    )

def validate_password_logic(password: str) -> dict:
    # bcrypt limite les mots de passe à 72 bytes
    if len(password.encode('utf-8')) > 72:
        raise ValidationError(
            field="password",
            message="Le mot de passe ne peut pas dépasser 72 caractères."
        )
    
    if is_strong_password(password) or is_medium_password(password):
        return {"valid": True}
    
    raise ValidationError(
        field="password",
        message="Mot de passe invalide : au moins 15 caractères ou 8 caractères avec chiffre et minuscule"
    )
#endregion

#region USER
USERNAME_REGEX = re.compile(r"^[a-zA-Z0-9]+(-[a-zA-Z0-9]+)*$")

#Vérifie le format autorisé du username
def is_valid_username_format(username: str) -> bool:
    return USERNAME_REGEX.fullmatch(username) is not None

#Vérifie si le username existe déjà en BDD
def is_username_taken(username: str, db: Session) -> bool:
    return db.query(User).filter(User.username == username).first() is not None

def validate_username_logic(username: str, db: Session):
    #Valide le username : format + unicité
    if not is_valid_username_format(username):
        raise ValidationError(
            field="username",
            message="Username may only contain letters, numbers, and single hyphens, and cannot begin or end with a hyphen."
        )

    if is_username_taken(username, db):
        raise ValidationError(
            field="username",
            message="This username is already taken."
        )

#endregion
