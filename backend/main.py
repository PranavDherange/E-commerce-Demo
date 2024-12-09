from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from starlette.middleware.cors import CORSMiddleware
import os,pdb
from core.config import get_settings

# Get the current file's directory (settings.py)
current_dir = os.path.abspath(__file__)
# Define the BASE_DIR by going one level up (assuming your project's main file is one level below the root)
BASE_DIR = os.path.dirname(current_dir)

from core.log_config import logger

settings = get_settings()

app = FastAPI()

origins = settings.origins

app.add_middleware(
    CORSMiddleware,
    # TrustedHostMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    # allowed_hosts=["*"],
)

# Import your API routers here
from api.router import router as router_v1
# Add your API routers to the FastAPI app
app.include_router(router_v1)

if __name__ == "__main__":
    import uvicorn
    pdb.set_trace()
    logger.info("Starting the application...")
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
