from fastapi import APIRouter

from app.api.schemas import ApproveRequest
from app.dependencies import graph

router = APIRouter()


@router.post("/approve")
async def approve(req: ApproveRequest):
    config = {"configurable": {"thread_id": req.thread_id}}

    graph.update_state(config, {
        "twitter_approved": req.approvals.get("twitter", False),
        "linkedin_approved": req.approvals.get("linkedin", False),
        "newsletter_approved": req.approvals.get("newsletter", False),
        "regenerate_twitter": False,
        "regenerate_linkedin": False,
        "regenerate_newsletter": False,
        "twitter_revision_request": "",
        "linkedin_revision_request": "",
        "newsletter_revision_request": "",
    })

    # SSE will resume the graph when the frontend reconnects
    return {"status": "state_updated", "thread_id": req.thread_id}
