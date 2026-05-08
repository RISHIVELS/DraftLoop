import asyncio
from langchain_groq import ChatGroq
from langchain_core.output_parsers import JsonOutputParser

from app.config import settings
from app.graph.state import DraftLoopState
from app.graph.prompts.newsletter import NEWSLETTER_PROMPT


def _format_key_points(points: list[str]) -> str:
    return "\n".join(f"- {p}" for p in points)


async def newsletter_node(state: DraftLoopState) -> dict:
    await asyncio.sleep(settings.agent_delay_seconds)
    summary = state["parsed_summary"]
    llm = ChatGroq(model=settings.model_name, temperature=0.7, groq_api_key=settings.groq_api_key,
                   model_kwargs={"response_format": {"type": "json_object"}})
    chain = NEWSLETTER_PROMPT | llm | JsonOutputParser()
    result = await chain.ainvoke({
        "main_topic": summary["main_topic"],
        "tone": summary["tone"],
        "key_points": _format_key_points(summary["key_points"]),
        "revision_request": state.get("newsletter_revision_request") or "No revision request. Write the best version from scratch.",
    })
    return {
        "newsletter_draft": result,
        "agent_events": [{"agent": "newsletter", "status": "done"}],
    }
