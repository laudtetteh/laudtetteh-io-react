import logging
import os
from logging.handlers import RotatingFileHandler
import sys

def setup_logging(name: str = "app", log_level: str = "INFO") -> logging.Logger:
    """
    Set up logging configuration with both file and console handlers.
    
    Args:
        name (str): Logger name
        log_level (str): Logging level (DEBUG, INFO, WARNING, ERROR, CRITICAL)
        
    Returns:
        logging.Logger: Configured logger instance
    """
    # Create logs directory if it doesn't exist
    log_dir = "logs"
    if not os.path.exists(log_dir):
        os.makedirs(log_dir)

    # Create logger
    logger = logging.getLogger(name)
    logger.setLevel(getattr(logging, log_level))

    # Prevent duplicate handlers
    if logger.handlers:
        return logger

    # Create formatters
    console_formatter = logging.Formatter(
        '%(asctime)s - %(name)s - %(levelname)s - %(message)s'
    )
    file_formatter = logging.Formatter(
        '%(asctime)s - %(name)s - %(levelname)s - %(filename)s:%(lineno)d - %(message)s'
    )

    # Console handler
    console_handler = logging.StreamHandler(sys.stdout)
    console_handler.setFormatter(console_formatter)
    logger.addHandler(console_handler)

    # File handler (rotating)
    file_handler = RotatingFileHandler(
        os.path.join(log_dir, f"{name}.log"),
        maxBytes=10*1024*1024,  # 10MB
        backupCount=5
    )
    file_handler.setFormatter(file_formatter)
    logger.addHandler(file_handler)

    # Set different levels for handlers if needed
    if os.getenv("ENVIRONMENT") == "production":
        console_handler.setLevel(logging.WARNING)
        file_handler.setLevel(logging.INFO)
    else:
        console_handler.setLevel(logging.DEBUG)
        file_handler.setLevel(logging.INFO)

    return logger
