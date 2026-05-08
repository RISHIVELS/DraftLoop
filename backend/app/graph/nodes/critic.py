import asyncio
from langchain_groq import ChatGroq
from langchain_core.output_parsers import JsonOutputParser

from app.config import settings
from app.graph.state import DraftLoopState
from app.graph.prompts.critic import CRITIC_PROMPT


async def critic_node(state: DraftLoopState) -> dict:
    await asyncio.sleep(settings.agent_delay_seconds)
    llm = ChatGroq(model=settings.model_name, temperature=0.3, groq_api_key=settings.groq_api_key,
                   model_kwargs={"response_format": {"type": "json_object"}})
    chain = CRITIC_PROMPT | llm | JsonOutputParser()
    result = await chain.ainvoke({
        "twitter_draft": state.get("twitter_draft", {}).get("content", ""),
        "linkedin_draft": state.get("linkedin_draft", {}).get("content", ""),
        "newsletter_draft": state.get("newsletter_draft", {}).get("content", ""),
    })
    return {
        "twitter_feedback": result.get("twitter"),
        "linkedin_feedback": result.get("linkedin"),
        "newsletter_feedback": result.get("newsletter"),
        "agent_events": [{"agent": "critic", "status": "done"}],
    }
