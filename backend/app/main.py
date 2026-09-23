from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.v1.router import api_router
from app.core.config import settings
from app.services.ml_service import ml_service


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan manager to handle model startup/shutdown."""
    ml_service.load_model()
    yield


def create_application() -> FastAPI:
    """Create and configure the FastAPI application instance."""
    app = FastAPI(
        title=settings.PROJECT_NAME,
        description=settings.DESCRIPTION,
        version=settings.VERSION,
        lifespan=lifespan,
    )

    # Enable CORS
    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.CORS_ORIGINS,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    # Mount routes at root for 100% backward compatibility with frontend
    app.include_router(api_router)

    # Also mount versioned API under /api/v1
    app.include_router(api_router, prefix=settings.API_V1_STR)

    return app


app = create_application()
