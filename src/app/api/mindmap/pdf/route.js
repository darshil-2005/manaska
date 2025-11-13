import { ChatGroq } from "@langchain/groq";
import { spawnSync } from "child_process";
import fs from "fs";
import path from "path";
import os from "os";

export const runtime = "nodejs";

export async function POST(req) {
  try {
    const formData = await req.formData();
    const file = formData.get("file");

    if (!file) {
      return new Response(
        JSON.stringify({ error: "No PDF file provided." }),
        { status: 400 }
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const tempPath = path.join(os.tmpdir(), `upload_${Date.now()}.pdf`);
    fs.writeFileSync(tempPath, buffer);

    const workerPath = path.resolve("src/utils/pdfExtractWorker.cjs");
    const { stdout, stderr } = spawnSync("node", [workerPath, tempPath], {
      encoding: "utf-8",
    });

    if (stderr) console.error("PDF parse stderr:", stderr);
    const extractedText = stdout.trim();

    if (!extractedText) {
      return new Response(
        JSON.stringify({ error: "PDF contains no readable text." }),
        { status: 400 }
      );
    }

    console.log("Extracted text from PDF:", extractedText.slice(0, 300), "...");

    const llm = new ChatGroq({
      apiKey: process.env.GROQ_API_KEY,
      model: "llama-3.1-8b-instant",
      temperature: 0.6,
    });

    const aiPrompt = `
You are an expert mind map generator.

Generate a deeply nested JSON mind map based on the following extracted text.

Each node must follow this format:
{
  "id": "<unique_id_in_lowercase_with_underscores>",
  "label": "<short descriptive text>",
  "relation": "root" | "subtopic",
  "children": []
}

Guidelines:
- Output ONLY valid JSON — no markdown or commentary.
- Root node must have "relation": "root".
- Include at least 3 levels of hierarchy.
- Summarize if text is long.

Extracted text:
${extractedText.slice(0, 4000)}
`;

    const response = await llm.invoke([{ role: "user", content: aiPrompt }]);
    const raw = (response.content || "").trim();

    console.log("Raw LLM Output (PDF):", raw.slice(0, 300), "...");

    let cleaned = raw
      .replace(/```(?:json|js|javascript)?/gi, "")
      .replace(/```/g, "")
      .replace(/^[^{]*({[\s\S]*})[^}]*$/m, "$1")
      .replace(/,\s*([\]}])/g, "$1")
      .trim();

    let parsed;
    try {
      parsed = JSON.parse(cleaned);
    } catch (err) {
      console.error("Failed to parse LLM JSON:", cleaned);
      return new Response(
        JSON.stringify({ error: "Failed to parse LLM output.", raw }),
        { status: 500 }
      );
    }

    return new Response(
      JSON.stringify({ mindmap: parsed }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("PDF Mindmap API error:", err);
    return new Response(
      JSON.stringify({ error: "Internal server error", details: String(err) }),
      { status: 500 }
    );
  }
}
