import { ChatGroq } from "@langchain/groq";
import { spawnSync } from "child_process";
import fs from "fs";
import path from "path";
import os from "os";
import { db } from "../../../../../db/db";
import { map } from "../../../../../db/schema";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import {
  DEFAULT_KEY_NOT_CONFIGURED,
  USER_KEY_NOT_FOUND,
  resolveGroqApiKey,
} from "../../../../utils/resolveGroqApiKey.js";

const JWT_SECRET = process.env.JWT_SECRET;

export const runtime = "nodejs";

export async function POST(req) {
  try {
    // Get user from cookie
    const cookieStore = await cookies();
    const token = cookieStore.get("token");

    if (!token) {
      return new Response(
        JSON.stringify({ error: "Unauthorized - No token provided" }),
        { status: 401 }
      );
    }

    // Decode JWT to get user info
    let userData;
    try {
      userData = jwt.verify(token.value, JWT_SECRET);
    } catch (error) {
      return new Response(
        JSON.stringify({ error: "Unauthorized - Invalid token" }),
        { status: 401 }
      );
    }

    const formData = await req.formData();
    const useUserKey = formData.get("useUserApiKey") === "true";
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

    let apiKey;
    try {
      ({ apiKey } = await resolveGroqApiKey({
        userId: userData.id,
        useUserKey,
      }));
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      if (message === USER_KEY_NOT_FOUND) {
        return new Response(
          JSON.stringify({ error: "No user API key configured" }),
          { status: 400 }
        );
      }
      if (message === DEFAULT_KEY_NOT_CONFIGURED) {
        return new Response(
          JSON.stringify({ error: "Server missing default Groq API key" }),
          { status: 500 }
        );
      }

      console.error("resolveGroqApiKey error (PDF):", error);
      return new Response(
        JSON.stringify({ error: "Failed to resolve API key" }),
        { status: 500 }
      );
    }

    const llm = new ChatGroq({
      apiKey,
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
      console.log("Failed to parse LLM JSON:", cleaned);
      return new Response(
        JSON.stringify({ error: "Failed to parse LLM output.", raw }),
        { status: 500 }
      );
    }

    // Convert mindmap to DSL for storage
    const { parseMindmapToDSL } = await import("../../../../utils/parseJsonToDSL.js");
    const dslCode = parseMindmapToDSL(parsed);

    // Create map entry in database
    const [newMap] = await db
      .insert(map)
      .values({
        id: crypto.randomUUID(),
        title: parsed.label || "PDF Mindmap",
        description: `Generated from PDF: ${file.name}\n\nExtracted text preview:\n${extractedText.slice(0, 500)}...`,
        userId: userData.id,
        url: dslCode, // Storing DSL code in url field
        pinned: false,
      })
      .returning();

    // Return map without sensitive fields
    const { userId, createdAt, updatedAt, ...mapData } = newMap;

    return new Response(
      JSON.stringify({ mindmap: parsed, map: mapData }),
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
