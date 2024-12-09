from loguru import logger
import os
from main import BASE_DIR

format = "{time:YYYY-MM-DDTHH:mm:ss.SS} | {level} | {function} | {module} | {name} | {file} | {line} | {message}"
log_dir = os.path.join(BASE_DIR,'logs','')

logger.configure(
    handlers=[
        {
            "sink": os.path.join(log_dir, "error.log"),
            "colorize": False,
            "format": format,
            "rotation": "00:00",
            "level": "WARNING",
        },
        {
            "sink": os.path.join(log_dir, "trace.log"),
            "colorize": False,
            "format": format,
            "rotation": "00:00",
            "level": "TRACE",
        }
    ]
)
