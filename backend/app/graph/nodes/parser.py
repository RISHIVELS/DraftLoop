import asyncio
import json
import re
from langchain_groq import ChatGroq
from langchain_core.output_parsers import JsonOutputParser

from app.config import settings
from app.graph.state import DraftLoopState
from app.graph.prompts.parser import PARSER_PROMPT

_JSON_MODE = {"response_format": {"type": "json_object"}}


def _extract_json(text: str) -> dict:
    """Strip markdown fences and parse JSON, with a best-effort fallback."""
    text = re.sub(r"^```(?:json)?\s*", "", text.strip())
    text = re.sub(r"\s*```$", "", text.strip())
    return json.loads(text)


async def parser_node(state: DraftLoopState) -> dict:
    await asyncio.sleep(settings.agent_delay_seconds)
    llm = ChatGroq(
        model=settings.model_name,
        temperature=0.3,
        groq_api_key=settings.groq_api_key,
        model_kwargs=_JSON_MODE,
    )
    chain = PARSER_PROMPT | llm | JsonOutputParser()
    try:
        result = await chain.ainvoke({"article": state["article"]})
    except Exception:
        # Fallback: get raw content and parse manually
        raw = await (PARSER_PROMPT | llm).ainvoke({"article": state["article"]})
        result = _extract_json(raw.content)
    return {
        "parsed_summary": result,
        "agent_events": [{"agent": "parser", "status": "done"}],
    }
