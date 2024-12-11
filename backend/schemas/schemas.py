from pydantic import BaseModel
from typing import Optional

class ResponseBody(BaseModel):
    status: str
    status_code: int
    data: dict
    message: str

class CartItem(BaseModel):
    product_name: str
    quantity: int
    price: float

class Order(BaseModel):
    total_amount: float
    discount_code: Optional[str]=None
    discount_applied: Optional[float]=None