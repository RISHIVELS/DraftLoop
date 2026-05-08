import asyncio
from langchain_groq import ChatGroq
from langchain_core.output_parsers import JsonOutputParser

from app.config import settings
from app.graph.state import DraftLoopState
from app.graph.prompts.twitter import TWITTER_PROMPT


def _format_key_points(points: list[str]) -> str:
    return "\n".join(f"- {p}" for p in points)


async def twitter_node(state: DraftLoopState) -> dict:
    await asyncio.sleep(settings.agent_delay_seconds)
    summary = state["parsed_summary"]
    llm = ChatGroq(model=settings.model_name, temperature=0.8, groq_api_key=settings.groq_api_key,
                   model_kwargs={"response_format": {"type": "json_object"}})
    chain = TWITTER_PROMPT | llm | JsonOutputParser()
    result = await chain.ainvoke({
        "main_topic": summary["main_topic"],
        "tone": summary["tone"],
        "key_points": _format_key_points(summary["key_points"]),
        "revision_request": state.get("twitter_revision_request") or "No revision request. Write the best version from scratch.",
    })
    return {
        "twitter_draft": result,
        "agent_events": [{"agent": "twitter", "status": "done"}],
    }
