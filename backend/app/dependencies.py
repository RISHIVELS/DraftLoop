"""
Module-level singleton graph instance.
MemorySaver stores thread state in-memory — the graph must NOT be recreated
per-request or all checkpointed state is lost between /generate and /approve.

pending_states: stores initial states for threads that haven't been picked up
by the SSE stream yet. generate.py writes here; status.py pops and runs.
"""
from app.graph.graph import build_graph

graph = build_graph()

# thread_id → initial DraftLoopState dict, consumed once by the SSE endpoint
pending_states: dict[str, dict] = {}
