from sqlmodel import Session, create_engine
from core.config import settings

# Create the SQLModel engine using the configured database URL
engine = create_engine(settings.database_url, echo=True)

def get_session():
    """
    Yield a SQLModel Session instance,
    to be used as a dependency in FastAPI endpoints.
    """
    with Session(engine) as session:
        yield session
