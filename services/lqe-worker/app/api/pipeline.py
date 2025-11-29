# services/lqe-worker/app/api/pipeline.py
from fastapi import APIRouter, HTTPException
from uuid import uuid4
from datetime import datetime, timezone
from typing import List

from app.core.models import (
    LQERunRequest,
    LQERunResponse,
    LQERunLead,
    ScoreBreakdown,
)

router = APIRouter()


def _basic_tier_from_score(score: int) -> str:
    if score >= 90:
        return "HOT"
    if score >= 70:
        return "WARM"
    if score >= 40:
        return "COLD"
    return "IGNORE"


@router.post("/pipeline/run", response_model=LQERunResponse)
async def run_pipeline(payload: LQERunRequest) -> LQERunResponse:
    """
    Phase 2: stub pipeline that only uses manual company list.
    - Later phases will:
      * read PDFs/ZIP/Excel
      * enrich via web/LinkedIn
      * run real scoring logic
    """

    companies: List[str] = []

    if payload.inputMode == "manual":
        if not payload.companies:
            raise HTTPException(
                status_code=400, detail="companies is required for manual mode"
            )
        companies = payload.companies
    else:
        # For now, just stub out an empty list for file-based modes.
        # Phase 3 will parse uploadContext.files and extract companies.
        companies = []

    leads: List[LQERunLead] = []

    for name in companies:
        # Completely dummy scoring for now
        base_score = 75  # warm by default, replaced later
        scores = ScoreBreakdown(
            industryRelevance=80,
            contactQuality=60,
            companySize=70,
            webPresence=65,
            linkedinActivity=50,
            keywordMatch=80,
            finalScore=base_score,
        )

        tier = _basic_tier_from_score(scores.finalScore)
        notes = f"Stub note for {name}. Real notes will be generated in scoring engine."

        leads.append(
            LQERunLead(
                id=str(uuid4()),
                companyName=name,
                website=None,
                emails=[],
                phones=[],
                linkedin=None,
                scores=scores,
                tier=tier,  # type: ignore
                notes=notes,
            )
        )

    run_id = str(uuid4())
    meta = {
        "inputMode": payload.inputMode,
        "totalCompanies": len(leads),
        "processedAt": datetime.now(timezone.utc).isoformat(),
    }

    return LQERunResponse(runId=run_id, leads=leads, meta=meta)
