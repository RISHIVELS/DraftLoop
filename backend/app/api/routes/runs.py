from fastapi import APIRouter, HTTPException

from app.dependencies import graph

router = APIRouter()


@router.get("/runs/{thread_id}")
async def get_run(thread_id: str):
    config = {"configurable": {"thread_id": thread_id}}
    try:
        state = graph.get_state(config)
        if not state or not state.values:
            raise HTTPException(status_code=404, detail="Thread not found")
        snapshot = {k: v for k, v in state.values.items() if k != "agent_events"}
        return snapshot
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
