from app.core.scoring import compute_scores_from_enrichment


def test_basic_scoring_hot():
    enrich = {
        "website": "http://example.com",
        "emails": ["sales@example.com", "info@example.com"],
        "phones": ["9999999999"],
        "linkedin": "https://linkedin.com/company/example",
        "keywordScore": 90,
        "companySizeScore": 80,
    }

    scores, tier, reasons, notes = compute_scores_from_enrichment(
        "Example Filters Pvt Ltd", enrich
    )

    assert scores.finalScore >= 70
    assert tier in ["HOT", "WARM"]
    assert len(reasons) >= 3
    assert "keyword" in notes.lower()
