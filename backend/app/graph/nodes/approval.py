from app.graph.state import DraftLoopState


async def approval_node(state: DraftLoopState) -> dict:
    """
    Human-in-the-loop gate. The graph is compiled with interrupt_before=["approval_node"],
    so this node only executes after the user provides explicit approval input via update_state().
    When it does run, it just passes state through unchanged — the approval flags were
    injected by the API layer before resuming.
    """
    return {}
