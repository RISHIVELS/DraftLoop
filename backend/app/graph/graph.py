from langgraph.graph import StateGraph, START, END
from langgraph.checkpoint.memory import MemorySaver

from app.graph.state import DraftLoopState
from app.graph.nodes.parser import parser_node
from app.graph.nodes.twitter import twitter_node
from app.graph.nodes.linkedin import linkedin_node
from app.graph.nodes.newsletter import newsletter_node
from app.graph.nodes.critic import critic_node
from app.graph.nodes.approval import approval_node
from app.graph.routing import fan_out_to_platforms, should_regenerate_router


def build_graph():
    builder = StateGraph(DraftLoopState)

    # Register all nodes
    builder.add_node("parser_node", parser_node)
    builder.add_node("twitter_node", twitter_node)
    builder.add_node("linkedin_node", linkedin_node)
    builder.add_node("newsletter_node", newsletter_node)
    builder.add_node("critic_node", critic_node)
    builder.add_node("approval_node", approval_node)

    # Regen nodes reuse the same functions
    builder.add_node("regen_twitter", twitter_node)
    builder.add_node("regen_linkedin", linkedin_node)
    builder.add_node("regen_newsletter", newsletter_node)

    # Stage 1: start → parser
    builder.add_edge(START, "parser_node")

    # Stage 2: parser → parallel platform agents via Send
    builder.add_conditional_edges("parser_node", fan_out_to_platforms)

    # Stage 2→3: all platform nodes fan-in at critic
    builder.add_edge("twitter_node", "critic_node")
    builder.add_edge("linkedin_node", "critic_node")
    builder.add_edge("newsletter_node", "critic_node")

    # Stage 3→4: critic → approval (will be interrupted here)
    builder.add_edge("critic_node", "approval_node")

    # Stage 4 routing: approval → regen or END
    builder.add_conditional_edges("approval_node", should_regenerate_router)

    # Regen → critic → approval loop
    builder.add_edge("regen_twitter", "critic_node")
    builder.add_edge("regen_linkedin", "critic_node")
    builder.add_edge("regen_newsletter", "critic_node")

    checkpointer = MemorySaver()
    return builder.compile(
        checkpointer=checkpointer,
        interrupt_before=["approval_node"],
    )
