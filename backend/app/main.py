from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.routes import generate, approve, regenerate, status, runs

app = FastAPI(title="DraftLoop API", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(generate.router, prefix="/api")
app.include_router(approve.router, prefix="/api")
app.include_router(regenerate.router, prefix="/api")
app.include_router(status.router, prefix="/api")
app.include_router(runs.router, prefix="/api")


@app.get("/health")
async def health():
    return {"status": "ok"}
