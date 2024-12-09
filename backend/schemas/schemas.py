from pydantic import BaseModel

class ResponseBody(BaseModel):
    status: str
    status_code: int
    data: dict
    message: str

class CartItem(BaseModel):
    product_name: str
    quantity: int
    price: float