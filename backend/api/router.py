from fastapi import APIRouter
from api.endpoints import cart

router = APIRouter(prefix="/v1", responses={422:{'description':'Not Found'}})

router.include_router(cart.router, prefix="/cart", tags=["v1 cart"])