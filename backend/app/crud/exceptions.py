from fastapi.responses import JSONResponse
from fastapi import Request, status
from fastapi.exceptions import RequestValidationError

class ValidationError(Exception):
    def __init__(self, field: str, message: str):
        self.field = field
        self.message = message


async def validation_exception_handler(request: Request, exc: ValidationError):
    return JSONResponse(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        content={
            "errors": {
                exc.field: exc.message
            }
        }
    )

async def pydantic_validation_handler(request: Request, exc: RequestValidationError):
    # Reformat the error into the same structure: { "errors": { field: message } }
    errors = {}
    for err in exc.errors():
        field = ".".join(str(loc) for loc in err['loc'] if loc != 'body')
        message = err['msg']
        errors[field] = message

    return JSONResponse(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        content={"errors": errors}
    )