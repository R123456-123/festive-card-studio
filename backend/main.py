import os
from random import choice

from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

load_dotenv()
CAPTION_API_KEY = os.getenv("CAPTION_API_KEY", "")

app = FastAPI(title="Festive Card Studio API")
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost",
        "http://localhost:5500",
        "http://localhost:5173",
        "http://127.0.0.1",
        "http://127.0.0.1:5500",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["POST"],
    allow_headers=["*"],
)

SAFE_FALLBACK = "Wishing you bright moments and beautiful memories."
MOCK_CAPTIONS = [
    "Small joys, bright lights, and a little extra sparkle ✨",
    "Sending warm wishes and main-character festive energy 💫",
    "Good vibes, sweet treats, and happy hearts.",
]
BLOCKED_TERMS = {"hate", "kill", "violent", "stupid", "ugly"}


class CaptionRequest(BaseModel):
    festival: str = Field(default="festive", max_length=40)
    vibe: str = Field(default="warm", max_length=40)
    language: str = Field(default="English", max_length=40)


class CaptionResponse(BaseModel):
    caption: str


def is_safe(value: str) -> bool:
    lowered = value.casefold()
    return not any(term in lowered for term in BLOCKED_TERMS)


@app.post("/caption", response_model=CaptionResponse)
def create_caption(request: CaptionRequest) -> CaptionResponse:
    if not all(is_safe(value) for value in (request.festival, request.vibe, request.language)):
        return CaptionResponse(caption=SAFE_FALLBACK)

    # Keep v1 deterministic and offline-friendly. A configured key is loaded for
    # a future provider integration without making user data leave this service.
    caption = choice(MOCK_CAPTIONS)
    if CAPTION_API_KEY:
        caption = f"{request.vibe.title()} {request.festival.title()} wishes ✨"
    return CaptionResponse(caption=caption if is_safe(caption) else SAFE_FALLBACK)
