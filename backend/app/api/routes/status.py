import json
from fastapi import APIRouter
from sse_starlette.sse import EventSourceResponse

from app.dependencies import graph, pending_states

router = APIRouter()

# Node names that map to the 5 frontend agent status keys
_NODE_TO_AGENT = {
    "parser_node": "parser",
    "twitter_node": "twitter",
    "linkedin_node": "linkedin",
    "newsletter_node": "newsletter",
    "regen_twitter": "twitter",
    "regen_linkedin": "linkedin",
    "regen_newsletter": "newsletter",
    "critic_node": "critic",
}


@router.get("/status/{thread_id}")
async def status_stream(thread_id: str):
    async def event_generator():
        config = {"configurable": {"thread_id": thread_id}}

        # Pop the initial state if this is a fresh run; None = resume from checkpoint
        initial_input = pending_states.pop(thread_id, None)

        try:
            async for event in graph.astream_events(initial_input, config, version="v2"):
                event_name = event.get("event", "")
                node_name = event.get("name", "")

                if node_name not in _NODE_TO_AGENT:
                    continue

                agent = _NODE_TO_AGENT[node_name]

                if event_name == "on_chain_start":
                    yield {
                        "data": json.dumps({
                            "agent": agent,
                            "status": "running",
                            "node": node_name,
                        }),
                        "event": "agent_status",
                    }

                elif event_name == "on_chain_end":
                    try:
                        state_snapshot = graph.get_state(config).values
                        snapshot_data = {k: v for k, v in state_snapshot.items() if k != "agent_events"}
                    except Exception:
                        snapshot_data = {}

                    yield {
                        "data": json.dumps({
                            "agent": agent,
                            "status": "done",
                            "node": node_name,
                            "state": snapshot_data,
                        }),
                        "event": "agent_status",
                    }

        except Exception as e:
            yield {
                "data": json.dumps({"type": "error", "message": str(e)}),
                "event": "error",
            }
            return

        # Terminal event — graph reached interrupt or END
        try:
            state_snapshot = graph.get_state(config).values
            snapshot_data = {k: v for k, v in state_snapshot.items() if k != "agent_events"}
        except Exception:
            snapshot_data = {}

        yield {
            "data": json.dumps({"type": "complete", "state": snapshot_data}),
            "event": "complete",
        }

    return EventSourceResponse(event_generator())
