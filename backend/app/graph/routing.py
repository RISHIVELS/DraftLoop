from langgraph.types import Send
from langgraph.graph import END

from app.graph.state import DraftLoopState


def fan_out_to_platforms(state: DraftLoopState) -> list[Send]:
    """After parser, fire all three platform agents in parallel."""
    return [
        Send("twitter_node", state),
        Send("linkedin_node", state),
        Send("newsletter_node", state),
    ]


def should_regenerate_router(state: DraftLoopState):
    """
    After approval_node, decide next step:
    - All approved → END
    - Some need regen → fan-out only those agents (parallel)
    - Max regens hit everywhere → END
    """
    all_approved = (
        state.get("twitter_approved", False)
        and state.get("linkedin_approved", False)
        and state.get("newsletter_approved", False)
    )
    if all_approved:
        return END

    sends = []
    for platform in ("twitter", "linkedin", "newsletter"):
        needs_regen = state.get(f"regenerate_{platform}", False)
        count = state.get(f"{platform}_regen_count", 0)
        if needs_regen and count < 3:
            sends.append(Send(f"regen_{platform}", {
                **state,
                f"regenerate_{platform}": False,
            }))

    if sends:
        return sends

    return END
