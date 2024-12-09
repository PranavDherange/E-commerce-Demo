from fastapi import APIRouter, HTTPException
from core.log_config import logger
from core.config import get_settings
import sys
from schemas.schemas import ResponseBody

settings = get_settings()

router = APIRouter()

@router.get("/test", response_model=ResponseBody)
async def test():
    try:
      return ResponseBody(
        status='success',
        status_code='200',
        data={"message":"hello world"},
        message='Successfully sent data'
      )
    except Exception as e:
        a,b,c = sys.exc_info()
        line_no = c.tb_lineno
        print(f"Exception: {str(e)} --- {line_no}")
        logger.error(f"Exception: {str(e)}, At Line No. : {line_no}")
        raise HTTPException(status_code=500, message="Error occurred while fetching data. Something went wrong")