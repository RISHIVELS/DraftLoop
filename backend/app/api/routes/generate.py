import uuid
from fastapi import APIRouter

from app.api.schemas import GenerateRequest, GenerateResponse
from app.dependencies import pending_states

router = APIRouter()


@router.post("/generate", response_model=GenerateResponse)
async def generate(req: GenerateRequest):
    thread_id = str(uuid.uuid4())
    # Store initial state — SSE endpoint will pick this up and run the graph
    pending_states[thread_id] = {
        "article": req.article,
        "thread_id": thread_id,
        "parsed_summary": None,
        "twitter_draft": None,
        "linkedin_draft": None,
        "newsletter_draft": None,
        "twitter_feedback": None,
        "linkedin_feedback": None,
        "newsletter_feedback": None,
        "twitter_revision_request": "",
        "linkedin_revision_request": "",
        "newsletter_revision_request": "",
        "twitter_approved": False,
        "linkedin_approved": False,
        "newsletter_approved": False,
        "regenerate_twitter": False,
        "regenerate_linkedin": False,
        "regenerate_newsletter": False,
        "twitter_regen_count": 0,
        "linkedin_regen_count": 0,
        "newsletter_regen_count": 0,
        "agent_events": [],
    }
    return GenerateResponse(thread_id=thread_id, status="ready")
