import { parseMindmapToDSL } from "./parseMindmapToDSL.js";

export async function generate_map(prompt) {
  try {
    console.log("⚡ Generating mind map for prompt:", prompt);

    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/api/canvas/mindmap`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt }),
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      console.error("Error from /api/canvas/mindmap:", err);
      throw new Error(err.error || "Failed to generate mind map from LLM.");
    }

    const data = await response.json();
    const mindmapJSON = data.mindmap;

    if (!mindmapJSON) throw new Error("Empty mindmap JSON returned.");

    const mapCode = parseMindmapToDSL(mindmapJSON);

    return {
      title: mindmapJSON.label || "Untitled Mind Map",
      mapCode,
    };
  } catch (error) {
    console.error("Error in generate_map utility:", error);
    throw error;
  }
}
