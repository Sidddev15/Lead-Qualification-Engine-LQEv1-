from app.api.pipeline import run_pipeline
from app.core.models import LQERunRequest
import asyncio


def test_manual_pipeline():
    payload = LQERunRequest(inputMode="manual", companies=["EEC Filters Pvt Ltd"])

    res = asyncio.run(run_pipeline(payload))

    assert res.meta["totalCompanies"] == 1
    lead = res.leads[0]

    assert lead.companyName == "EEC Filters Pvt Ltd"
    assert lead.scores.finalScore >= 0
    assert lead.tier in {"HOT", "WARM", "COLD", "IGNORE"}
