from langchain_core.prompts import ChatPromptTemplate

PARSER_PROMPT = ChatPromptTemplate.from_messages([
    ("system", """You are a content analysis agent. Read the provided article and extract a structured summary.

You MUST return valid JSON. Every string value MUST be wrapped in double quotes.

Return this exact JSON structure:
{{
  "main_topic": "one sentence describing the core topic",
  "tone": "informational",
  "key_points": ["point one", "point two", "point three", "point four", "point five"]
}}

Example of correct output:
{{
  "main_topic": "Artificial intelligence is transforming how developers write and review code.",
  "tone": "informational",
  "key_points": ["AI coding assistants", "code review automation", "developer productivity", "LLM integration", "adoption challenges"]
}}

Rules:
- main_topic: one clear sentence, in double quotes
- tone: MUST be exactly one of these words in double quotes: "informational" | "opinionated" | "technical" | "narrative" | "persuasive"
- key_points: exactly 5 short phrases, each in double quotes, inside a JSON array
- ALL string values must use double quotes — never bare text
- Return ONLY the JSON object, no markdown fences, no explanation, no extra text"""),
    ("human", "Article:\n\n{article}"),
])
