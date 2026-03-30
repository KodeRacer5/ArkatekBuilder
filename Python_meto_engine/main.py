from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Any, Dict
import json
from pathlib import Path

from scoring import score_assessment

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:3001", "http://localhost:3030"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

ENGINE_CONFIG_PATH = Path(__file__).parent / "engine_config.json"
ENGINE_CONFIG = json.loads(ENGINE_CONFIG_PATH.read_text(encoding="utf-8"))


class ScoreRequest(BaseModel):
    engine_config: Dict[str, Any] | None = None
    assessment: Dict[str, Any]


@app.get("/health")
def health():
    return {"status": "ok", "engine_version": ENGINE_CONFIG.get("engine_version")}


@app.post("/score")
def score(req: ScoreRequest):
    cfg = req.engine_config if req.engine_config and len(req.engine_config) > 1 else ENGINE_CONFIG
    result = score_assessment(cfg, req.assessment)
    return result
