from typing import Literal

from fastapi import FastAPI
from pydantic import BaseModel, Field

from .model import load_catalog, load_model, recommend

app = FastAPI(title="Sking Recommendation API", version="1.0.0")
model = load_model()
catalog = load_catalog()


class SkiProfile(BaseModel):
    taille_cm: float = Field(ge=130, le=220)
    poids_kg: float = Field(ge=35, le=180)
    niveau: int = Field(ge=1, le=3)
    style: Literal["piste", "all_mountain", "freeride"]
    budget: float = Field(ge=0, le=10000)


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok", "model": "lightgbm"}


@app.post("/recommendations")
def recommendations(profile: SkiProfile) -> dict:
    return recommend(
        model=model,
        catalog=catalog,
        height_cm=profile.taille_cm,
        weight_kg=profile.poids_kg,
        level=profile.niveau,
        style=profile.style,
        budget=profile.budget,
    )
