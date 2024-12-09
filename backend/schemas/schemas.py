from pydantic import BaseModel

class ResponseBody(BaseModel):
    status: str
    status_code: int
    data: dict
    message: str