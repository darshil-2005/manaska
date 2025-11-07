import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.GENAI_API_KEY;
if (!apiKey) {
  throw new Error("Missing GENAI_API_KEY env var");
}

const ai = new GoogleGenAI({ apiKey });

/**
 * Generate a map (title + Excalidraw code) given a user prompt.
 * @param {string} userPrompt
 * @returns {Promise<{ title: string, mapCode: string }>}
 */
export async function generate_map(userPrompt) {
  // Define a system / user prompt to instruct the model
  const systemPrompt = `You are a helpful assistant that takes a user prompt describing a map (floor plan, concept map, mind-map, site layout, etc.) and you produce:
  1) A succinct title summarizing the map.
  2) A piece of JSON or code compatible with the Excalidraw API (v2 or higher) that draws the map layout.
  
  The output must be valid JSON (or JS code string) that can be passed to Excalidraw’s \`initialData\` or \`elements\` array directly.
  
  Example:
  {
    "title": "Office Layout – Team A",
    "mapCode": "{ \"elements\": [ ... ] }"
  }

  Provide only a JSON object with \`title\` and \`mapCode\` properties. Do not wrap in extra text.`;

  const combinedPrompt = `${systemPrompt}\n\nUser prompt:\n${userPrompt}`;
  const contents = [
    { role: "user", parts: [{ text: combinedPrompt }] },
  ];

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",   // pick whichever model you have access to
      contents,
      config: {
        // you might add function-calling or other config if needed
      },
    });

    // We expect the top candidate to contain our JSON
    const candidate = response.candidates?.[0];
    if (!candidate) {
      throw new Error("No candidate returned from generateContent");
    }

    let text = candidate.content.parts?.[0].text;
    if (!text) {
      throw new Error("Empty content from model");
    }

    // Parse the returned JSON
    // Some models wrap JSON in markdown code fences. Strip them if present.
    const fenceMatch = text.match(/^```(?:json|javascript)?\n([\s\S]*?)\n```$/i);
    if (fenceMatch) {
      text = fenceMatch[1];
    }

    // If still not plain JSON, try to slice from first '{' to last '}'
    const firstBrace = text.indexOf("{");
    const lastBrace = text.lastIndexOf("}");
    if (firstBrace !== -1 && lastBrace !== -1) {
      const possibleJson = text.slice(firstBrace, lastBrace + 1);
      if (possibleJson.trim().startsWith("{") && possibleJson.trim().endsWith("}")) {
        text = possibleJson;
      }
    }

    let obj;
    try {
      obj = JSON.parse(text);
    } catch (parseErr) {
      throw new Error(`Failed to parse JSON from model: ${parseErr}\nReturned text: ${text}`);
    }

    if (typeof obj.title !== "string" || typeof obj.mapCode !== "string") {
      throw new Error(`Invalid output format: ${text}`);
    }

    return {
      title: obj.title,
      mapCode: obj.mapCode,
    };
  } catch (err) {
    console.error("generate_map error:", err);
    throw err;
  }
}
