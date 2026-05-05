import json
from pathlib import Path

from fastapi import APIRouter, HTTPException

router = APIRouter()

BASE_DIR = Path(__file__).resolve().parent
DATA_DIR = BASE_DIR.parent.parent.parent.parent / "data" / "cv"

CV_FILES = {
    "fr": DATA_DIR / "cv.fr.json",
    "en": DATA_DIR / "cv.en.json",
}


@router.get("/cv")
def get_cv(locale: str = "fr") -> dict:
    if locale not in CV_FILES:
        raise HTTPException(
            status_code=400,
            detail=f"Unsupported locale: {locale}",
        )

    cv_path = CV_FILES[locale]

    if not cv_path.exists():
        raise HTTPException(
            status_code=404,
            detail=f"CV file not found: {cv_path}",
        )

    with cv_path.open("r", encoding="utf-8") as file:
        cv_data = json.load(file)

    return cv_data
