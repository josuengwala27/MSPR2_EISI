from fastapi import APIRouter, HTTPException

from app.routers import consolidation, debug, health, pays

router = APIRouter()

# Re-export for main
__all__ = ["health", "pays", "consolidation", "debug"]
