import logging


def setup_logging() -> logging.Logger:
    logging.basicConfig(level=logging.INFO)
    logger = logging.getLogger("contact-form")
    return logger
