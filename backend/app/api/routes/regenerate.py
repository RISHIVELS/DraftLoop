from fastapi import APIRouter

from app.api.schemas import RegenerateRequest
from app.dependencies import graph

router = APIRouter()


@router.post("/regenerate")
async def regenerate(req: RegenerateRequest):
    config = {"configurable": {"thread_id": req.thread_id}}
    current = graph.get_state(config).values

    update: dict = {}
    for platform in req.platforms:
        update[f"regenerate_{platform}"] = True
        update[f"{platform}_regen_count"] = current.get(f"{platform}_regen_count", 0) + 1
        instruction = (req.instructions or {}).get(platform, "")
        update[f"{platform}_revision_request"] = instruction.strip()

    graph.update_state(config, update)

    # SSE will resume the graph when the frontend reconnects
    return {"status": "state_updated", "platforms": req.platforms, "thread_id": req.thread_id}
