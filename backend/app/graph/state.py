from typing import Annotated, Optional
from typing_extensions import TypedDict


class ParsedSummary(TypedDict):
    main_topic: str
    tone: str
    key_points: list[str]


class DraftContent(TypedDict):
    content: str
    platform: str


class CriticFeedback(TypedDict):
    score: int
    suggestion: str


def _append_events(a: list, b: list) -> list:
    return a + b


class DraftLoopState(TypedDict):
    # Input
    article: str
    thread_id: str

    # Stage 1: parser
    parsed_summary: Optional[ParsedSummary]

    # Stage 2: drafts
    twitter_draft: Optional[DraftContent]
    linkedin_draft: Optional[DraftContent]
    newsletter_draft: Optional[DraftContent]

    # Stage 3: critic
    twitter_feedback: Optional[CriticFeedback]
    linkedin_feedback: Optional[CriticFeedback]
    newsletter_feedback: Optional[CriticFeedback]

    # Optional user guidance for targeted regenerations
    twitter_revision_request: str
    linkedin_revision_request: str
    newsletter_revision_request: str

    # Stage 4: approvals
    twitter_approved: bool
    linkedin_approved: bool
    newsletter_approved: bool

    # Regeneration flags
    regenerate_twitter: bool
    regenerate_linkedin: bool
    regenerate_newsletter: bool

    # Regeneration counters (max 3 per platform)
    twitter_regen_count: int
    linkedin_regen_count: int
    newsletter_regen_count: int

    # SSE event queue — append-only across parallel branches
    agent_events: Annotated[list[dict], _append_events]
