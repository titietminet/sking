import os

os.environ.setdefault("OMP_NUM_THREADS", "1")

import json
from pathlib import Path

import joblib
import numpy as np
import pandas as pd
from lightgbm import LGBMRegressor
from sklearn.model_selection import cross_val_score, train_test_split
from sklearn.metrics import mean_absolute_error

ROOT = Path(__file__).resolve().parents[1]
MODEL_DIR = ROOT / "models"
MODEL_PATH = MODEL_DIR / "ski_length.joblib"
METRICS_PATH = MODEL_DIR / "metrics.json"
CATALOG_PATH = ROOT / "src" / "data" / "catalogue.json"

STYLES = ("piste", "all_mountain", "freeride")
NUMERIC_FEATURES = ("taille_cm", "poids_kg", "niveau")
STYLE_OFFSETS = {"piste": 0.0, "all_mountain": 1.5, "freeride": 3.0}


def build_training_data(size: int = 8000, seed: int = 42) -> pd.DataFrame:
    rng = np.random.default_rng(seed)
    data = pd.DataFrame({
        "taille_cm": rng.normal(172, 10, size).clip(150, 205),
        "poids_kg": rng.normal(72, 13, size).clip(45, 120),
        "niveau": rng.integers(1, 4, size),
        "style": rng.choice(STYLES, size),
    })
    base = data["taille_cm"] * 0.87 + (data["poids_kg"] - 70) * 0.25
    style_offset = data["style"].map(STYLE_OFFSETS)
    data["longueur_ideale"] = (
        base + style_offset + (data["niveau"] - 2) * 1.5 + rng.normal(0, 1.5, size)
    )
    return data


def build_features(data: pd.DataFrame) -> pd.DataFrame:
    features = data.loc[:, NUMERIC_FEATURES].copy()
    for style in STYLES:
        features[f"style_{style}"] = (data["style"] == style).astype(int)
    return features


def new_model() -> LGBMRegressor:
    return LGBMRegressor(
        n_estimators=300,
        learning_rate=0.05,
        random_state=42,
        n_jobs=1,
        verbosity=-1,
    )


def train_and_save() -> dict[str, float]:
    data = build_training_data()
    features = build_features(data)
    target = data["longueur_ideale"]
    train_features, test_features, train_target, test_target = train_test_split(
        features, target, test_size=0.2, random_state=0
    )

    model = new_model()
    model.fit(train_features, train_target)
    test_mae = mean_absolute_error(test_target, model.predict(test_features))
    cv_scores = -cross_val_score(
        new_model(), features, target, cv=5, scoring="neg_mean_absolute_error", n_jobs=1
    )

    model.fit(features, target)
    MODEL_DIR.mkdir(parents=True, exist_ok=True)
    joblib.dump(model, MODEL_PATH)

    metrics = {
        "test_mae_cm": round(float(test_mae), 3),
        "cross_validation_mae_cm": round(float(cv_scores.mean()), 3),
        "cross_validation_std_cm": round(float(cv_scores.std()), 3),
        "dataset_size": int(len(data)),
        "data_kind": "synthetic",
    }
    METRICS_PATH.write_text(json.dumps(metrics, indent=2), encoding="utf-8")
    return metrics


def load_catalog() -> list[dict]:
    with CATALOG_PATH.open(encoding="utf-8") as catalog_file:
        return json.load(catalog_file)


def load_model() -> LGBMRegressor:
    if not MODEL_PATH.is_file():
        raise FileNotFoundError(
            f"Modèle absent ({MODEL_PATH}). Lancez d’abord : python -m service.train_model"
        )
    return joblib.load(MODEL_PATH)


def predict_length(
    model: LGBMRegressor, height_cm: float, weight_kg: float, level: int, style: str
) -> float:
    profile = pd.DataFrame([{
        "taille_cm": height_cm,
        "poids_kg": weight_kg,
        "niveau": level,
        "style": style,
    }])
    return float(model.predict(build_features(profile))[0])


def recommend(
    model: LGBMRegressor,
    catalog: list[dict],
    height_cm: float,
    weight_kg: float,
    level: int,
    style: str,
    budget: float,
    top_n: int = 3,
) -> dict:
    target_length = predict_length(model, height_cm, weight_kg, level, style)
    candidates = []
    for ski in catalog:
        if ski["price"] > budget:
            continue
        score = abs(ski["length_cm"] - target_length)
        if style not in ski["styles"]:
            score += 3
        candidates.append({"id": ski["id"], "score": round(float(score), 2)})

    candidates.sort(key=lambda candidate: candidate["score"])
    return {
        "target_length_cm": round(target_length, 1),
        "recommendations": candidates[:top_n],
    }
