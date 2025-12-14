from typing import Tuple, List, Dict, Any
from .models import ScoreBreakdown

# Weights must sum to 1.0 (or close)
WEIGHTS = {
    "industryRelevance": 0.25,
    "contactQuality": 0.20,
    "companySize": 0.15,
    "webPresence": 0.15,
    "linkedinActivity": 0.10,
    "keywordMatch": 0.15,
}


def tier_from_score(score: int) -> str:
    if score >= 90:
        return "HOT"
    if score >= 70:
        return "WARM"
    if score >= 40:
        return "COLD"
    return "IGNORE"


def clamp_0_100(value: float) -> int:
    return max(0, min(100, int(round(value))))


def compute_contact_quality(emails: list[str], phones: list[str]) -> int:
    # Base 30, each unique contact channel pushes it up
    score = 30
    if emails:
        score += 20
    if len(emails) > 1:
        score += 10
    if phones:
        score += 15
    if len(phones) > 1:
        score += 10

    return clamp_0_100(score)


def compute_web_presence(website: str | None) -> int:
    if not website:
        return 20
    return 80  # later: probe HTTP status / SSL / etc.


def compute_linkedin_activity(linkedin: str | None) -> int:
    if not linkedin:
        return 20
    return 70  # later: followers, posts, employees count, etc.


def compute_scores_from_enrichment(
    company_name: str, enrich: Dict[str, Any]
) -> Tuple[ScoreBreakdown, str, List[str], str]:
    """
    Given company name + enrichment dictionary, compute:
    - ScoreBreakdown
    - Tier
    - Reasons list
    - Auto-generated notes string
    """

    website = enrich.get("website")
    linkedin = enrich.get("linkedin")
    emails: list[str] = enrich.get("emails", []) or []
    phones: list[str] = enrich.get("phones", []) or []
    keyword_score = int(enrich.get("keywordScore", 0))
    size_score = int(enrich.get("companySizeScore", 50))

    industry_relevance = clamp_0_100(keyword_score)
    contact_quality = compute_contact_quality(emails, phones)
    company_size = clamp_0_100(size_score)
    web_presence = compute_web_presence(website)
    linkedin_activity = compute_linkedin_activity(linkedin)
    keyword_match = clamp_0_100(keyword_score)

    final = (
        industry_relevance * WEIGHTS["industryRelevance"]
        + contact_quality * WEIGHTS["contactQuality"]
        + company_size * WEIGHTS["companySize"]
        + web_presence * WEIGHTS["webPresence"]
        + linkedin_activity * WEIGHTS["linkedinActivity"]
        + keyword_match * WEIGHTS["keywordMatch"]
    )

    final_score = clamp_0_100(final)
    tier = tier_from_score(final_score)

    # Reasons
    reasons: List[str] = []

    # Industry / keyword
    if industry_relevance >= 80:
        reasons.append("Strong keyword alignment with target industry.")
    elif industry_relevance >= 60:
        reasons.append("Moderate keyword alignment with target industry.")
    else:
        reasons.append("Weak or unclear keyword alignment.")

    # Contacts
    if len(emails) + len(phones) >= 3:
        reasons.append("Multiple contact channels available (emails/phones).")
    elif len(emails) + len(phones) >= 1:
        reasons.append("At least one contact channel available.")
    else:
        reasons.append("No direct contact information detected.")

    # Size
    if company_size >= 80:
        reasons.append("Likely large company (high size score).")
    elif company_size >= 60:
        reasons.append("Likely mid-size company.")
    else:
        reasons.append("Likely small or unknown company size.")

    # Web presence
    if website:
        reasons.append("Active web presence detected (website).")
    else:
        reasons.append("No website detected; weak web presence.")

    # LinkedIn
    if linkedin:
        reasons.append("Company has LinkedIn presence.")
    else:
        reasons.append("No LinkedIn profile detected.")

    # Auto-notes (condensed summary)
    notes_parts = [
        f"Tier: {tier}",
        f"Industry relevance: {industry_relevance}",
        f"Keyword relevance: {keyword_match}",
        f"Contact quality: {contact_quality} ({len(emails)} emails, {len(phones)} phones)",
        f"Company size score: {company_size}",
        f"Web presence: {'yes' if website else 'no'}",
        f"LinkedIn: {'yes' if linkedin else 'no'}",
    ]

    notes = f"{company_name}: " + "; ".join(notes_parts)

    scores = ScoreBreakdown(
        industryRelevance=industry_relevance,
        contactQuality=contact_quality,
        companySize=company_size,
        webPresence=web_presence,
        linkedinActivity=linkedin_activity,
        keywordMatch=keyword_match,
        finalScore=final_score,
    )

    return scores, tier, reasons, notes
