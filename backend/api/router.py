from fastapi import APIRouter
from api.endpoints import orders, admin


router = APIRouter(prefix="/v1", responses={422:{'description':'Not Found'}})

router.include_router(orders.router, prefix="/orders", tags=["v1 orders"])
router.include_router(admin.router, prefix="/admin", tags=["v1 admin"])