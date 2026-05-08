from pydantic import BaseModel


class GenerateRequest(BaseModel):
    article: str


class GenerateResponse(BaseModel):
    thread_id: str
    status: str


class ApproveRequest(BaseModel):
    thread_id: str
    approvals: dict[str, bool]  # {"twitter": True, "linkedin": False, "newsletter": True}


class RegenerateRequest(BaseModel):
    thread_id: str
    platforms: list[str]  # ["twitter"] or ["linkedin", "newsletter"]
    instructions: dict[str, str] | None = None


class DraftResult(BaseModel):
    platform: str
    content: str
    score: int
    suggestion: str
    approved: bool
    regen_count: int


class StateSnapshot(BaseModel):
    thread_id: str
    parsed_summary: dict | None = None
    twitter_draft: dict | None = None
    linkedin_draft: dict | None = None
    newsletter_draft: dict | None = None
    twitter_feedback: dict | None = None
    linkedin_feedback: dict | None = None
    newsletter_feedback: dict | None = None
    twitter_revision_request: str = ""
    linkedin_revision_request: str = ""
    newsletter_revision_request: str = ""
    twitter_approved: bool = False
    linkedin_approved: bool = False
    newsletter_approved: bool = False
    twitter_regen_count: int = 0
    linkedin_regen_count: int = 0
    newsletter_regen_count: int = 0
