from .website import extract_and_validate_website
from .emails import extract_emails
from .phones import extract_phones
from .linkedin import detect_linkedin
from .keywords import keyword_score as compute_keyword_score
from .company_size import size_score_stub


def enrich_company(company_name: str) -> dict:
    """
    In real world: we use web search (SerpAPI, Bing API),
    company registry APIs, LinkedIn APIs, etc.
    For now: deterministic logic using company_name only.
    """

    # Stage 1 — Treat company name as text for heuristic detection
    text = company_name

    website = extract_and_validate_website(text)
    linkedin = detect_linkedin(text)

    emails = extract_emails(text)
    phones = extract_phones(text)
    kw_score = compute_keyword_score(text)
    size_score = size_score_stub(company_name)

    # If no website detected → fallback: assume domain from company name
    if not website:
        # simple heuristic
        slug = (
            company_name.lower()
            .replace("pvt", "")
            .replace("ltd", "")
            .replace("&", "")
            .replace(" ", "")
        )
        website = f"http://{slug}.com"

    return {
        "website": website,
        "linkedin": linkedin,
        "emails": emails,
        "phones": phones,
        "keywordScore": kw_score,
        "companySizeScore": size_score,
    }
