from fastapi import FastAPI

app = FastAPI(title="FutureKawa — Mock backends BR/EC", version="0.1.0")

MOCK_DATA = {
    "BR": {"service": "mock-bresil", "port": 8002},
    "EC": {"service": "mock-equateur", "port": 8003},
}


@app.get("/api/v1/health")
def health() -> dict[str, str]:
    return {"status": "ok", "service": "mock-backend"}


@app.get("/")
def root() -> dict[str, str]:
    return {"service": "mock-bresil-equateur", "status": "skeleton"}
