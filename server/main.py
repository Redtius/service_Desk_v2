from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlmodel import SQLModel, Session, select
from sqlalchemy.exc import OperationalError
from core.config import settings
from db.session import engine
from core.security import get_password_hash
from db.models import Role, User

def create_db_and_tables():
    from sqlalchemy import text
    with engine.connect() as conn:
        conn.execute(text("DROP INDEX IF EXISTS ix_permission_name"))
    try:
        SQLModel.metadata.create_all(engine)
    except OperationalError:
        pass

def create_initial_data():
    """
    Seed initial admin role and user.
    """
    with Session(engine) as session:
        # Ensure Admin role exists
        admin_role = session.exec(select(Role).where(Role.name == "Admin")).first()
        if not admin_role:
            admin_role = Role(name="Admin", description="Administrator")
            session.add(admin_role)
            session.commit()
            session.refresh(admin_role)

        # Ensure admin user exists
        admin_email = "admin@corp.com"
        existing_user = session.exec(select(User).where(User.email == admin_email)).first()
        if not existing_user:
            admin_user = User(
                email=admin_email,
                password_hash=get_password_hash("admin123!"),
                full_name="Administrator",
                status="active",
                role_id=admin_role.id
            )
            session.add(admin_user)
            session.commit()

app = FastAPI(
    title="Service Desk API",
    version="0.1.0",
    description="API for user management, workflows, integrations and more.",
    docs_url="/",
    redoc_url=None,
)

# Configure CORS to allow React local development server
origins = [
    "http://localhost:3000",
    "http://localhost",
    "http://localhost:4028",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
def on_startup():
    create_db_and_tables()
    create_initial_data()

# Mount Auth router
from api.v1.endpoints.auth import router as auth_router
app.include_router(auth_router, prefix="/api/v1/auth", tags=["Auth"])

# Mount API routers
from api.v1.endpoints.users import router as users_router
app.include_router(users_router, prefix="/api/v1/users", tags=["Users"])
from api.v1.endpoints.permissions import router as perms_router
app.include_router(perms_router, prefix="/api/v1/permissions", tags=["Permissions"])
from api.v1.endpoints.roles import router as roles_router
app.include_router(roles_router, prefix="/api/v1/roles", tags=["Roles"])

from api.v1.endpoints.tickets import router as tickets_router
app.include_router(tickets_router, prefix="/api/v1/tickets", tags=["Tickets"])

from api.v1.endpoints.messages import router as messages_router
app.include_router(messages_router, prefix="/api/v1/messages", tags=["Messages"])

# from api.v1.endpoints.workflows import router as workflows_router
# app.include_router(workflows_router, prefix="/api/v1/workflows", tags=["Workflows"])

from api.v1.endpoints.agents import router as agents_router
app.include_router(agents_router, prefix="/api/v1/agents", tags=["Agents"])

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
