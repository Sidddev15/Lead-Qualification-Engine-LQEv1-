from typing import List, Optional, Literal
from pydantic import BaseModel, Field
from datetime import datetime

InputMode = Literal["manual", "pdf_zip", "excel"]
LeadTier = Literal["HOT", "WARM", "COLD", "IGNORE"]


class UploadFileMeta(BaseModel):
    filename: str
    original_name: str
    mimeType: str


class UploadContext(BaseModel):
    storage: Literal["local-temp"]
    files: List[UploadFileMeta]


class LQERunRequest(BaseModel):
    inputMode: InputMode
    companies: Optional[List[str]] = None
    UploadContext: Optional[UploadContext] = None


class ScoreBreakdown(BaseModel):
    industryRelevance: int = Field(0, ge=0, le=100)
    contactQuality: int = Field(0, ge=0, le=100)
    companySize: int = Field(0, ge=0, le=100)
    webPresence: int = Field(0, ge=0, le=100)
    linkedinActivity: int = Field(0, ge=0, le=100)
    keywordMatch: int = Field(0, ge=0, le=100)
    finalScore: int = Field(0, ge=0, le=100)


class LQERunLead(BaseModel):
    id: str
    companyName: str
    website: Optional[str] = None
    emails: List[str] = []
    phones: List[str] = []
    linkedin: Optional[str] = None
    scores: ScoreBreakdown
    tier: LeadTier
    notes: str


class LQERunResponse(BaseModel):
    runId: str
    leads: List[LQERunLead]
    meta: dict
