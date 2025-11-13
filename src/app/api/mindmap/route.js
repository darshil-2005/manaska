import { ChatGroq } from "@langchain/groq";

export async function POST(req) {
  try {
    const { prompt } = await req.json();

    if (!prompt || !prompt.trim()) {
      return new Response(
        JSON.stringify({ error: "Prompt cannot be empty." }),
        { status: 400 }
      );
    }

    console.log("Generating mindmap for:", prompt);

    const llm = new ChatGroq({
      apiKey: process.env.GROQ_API_KEY,
      model: "llama-3.1-8b-instant",
      temperature: 0.6,
    });

    const aiPrompt = `
You are an expert mind map generator.

Generate a deeply nested JSON mind map about the topic below.

Each node must follow this format:
{
  "id": "<unique_id_in_lowercase_with_underscores>",
  "label": "<short descriptive text>",
  "relation": "root" | "subtopic",
  "children": []
}

Guidelines:
- Output ONLY valid JSON — no markdown, no commentary.
- Root node must have "relation": "root".
- Include at least 3 levels (root → subtopic → detailed subtopic).
- IDs must be lowercase_with_underscores (no spaces).
- Use descriptive but short labels.
- Expand vague topics logically.

Topic: ${prompt}
`;

    const response = await llm.invoke([{ role: "user", content: aiPrompt }]);
    const raw = (response.content || "").trim();

    console.log("Raw LLM output:", raw.slice(0, 200), "...");

    let cleaned = raw
      .replace(/```(?:json|js|javascript)?/gi, "")
      .replace(/```/g, "")
      .replace(/^[^{]*({[\s\S]*})[^}]*$/m, "$1")
      .replace(/,\s*([\]}])/g, "$1")
      .trim();

    if (!cleaned.startsWith("{")) {
      const start = cleaned.indexOf("{");
      const end = cleaned.lastIndexOf("}");
      if (start !== -1 && end !== -1) {
        cleaned = cleaned.slice(start, end + 1);
      }
    }

    let parsed;
    try {
      parsed = JSON.parse(cleaned);
    } catch (err) {
      console.error("JSON parse failed:", cleaned);
      return new Response(
        JSON.stringify({ error: "Failed to parse LLM output", raw }),
        { status: 500 }
      );
    }

    console.log("Parsed mindmap JSON generated successfully!");

    return new Response(
      JSON.stringify({ mindmap: parsed }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );

  } catch (err) {
    console.error("API error:", err);
    return new Response(
      JSON.stringify({ error: "Failed to generate mindmap", details: String(err) }),
      { status: 500 }
    );
  }
}
