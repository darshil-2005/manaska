# main.py
from fastapi import FastAPI, File, UploadFile, HTTPException, Request
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from typing import Dict, List, Any
import io
import os
import asyncio
import inspect
import json
from llm_endpoint import router as llm_router, get_llm, _extract_text
from pydantic import BaseModel
import re
import json
from json import JSONDecodeError

# PDF extraction
import fitz  # PyMuPDF

# Image OCR (EasyOCR)
import numpy as np
from PIL import Image
import easyocr

MAX_FILE_SIZE = 5 * 1024 * 1024

app = FastAPI(title="PDF + Image OCR (EasyOCR)")

origins = [
    "http://localhost:3000",      # Allow localhost to request in development.
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

_LANGS = os.environ.get("EASYOCR_LANGS", "en").split(",")

_use_gpu = bool(int(os.environ.get("EASYOCR_GPU", "0")))
reader = easyocr.Reader(_LANGS, gpu=_use_gpu)  # this loads model into memory
def _extract_json_from_text(text: str) -> str | None:
    """
    Try to extract the first JSON object from a text response.
    Handles cases like:
    - ```json ... ```
    - plain text before/after the JSON
    """
    if not text:
        return None

    # If it's already valid JSON, just return it
    try:
        json.loads(text)
        return text
    except JSONDecodeError:
        pass

    # Remove markdown code fences if present
    # e.g. ```json { ... } ``` or ``` { ... } ```
    fence_match = re.search(r"```(?:json)?(.*)```", text, re.DOTALL | re.IGNORECASE)
    if fence_match:
        candidate = fence_match.group(1).strip()
        try:
            json.loads(candidate)
            return candidate
        except JSONDecodeError:
            text = candidate  # keep trying below with braces

    # Fallback: take substring between first '{' and last '}'
    start = text.find("{")
    end = text.rfind("}")
    if start != -1 and end != -1 and end > start:
        candidate = text[start : end + 1]
        try:
            json.loads(candidate)
            return candidate
        except JSONDecodeError:
            return None

    return None

async def _call_llm(
    model: str,
    api_key: str,
    messages: List[Dict[str, str]],
    max_tokens: int = 512,
    temperature: float = 0.2,
) -> str:
    """
    Shared helper to call any configured LLM (OpenAI, Groq, DeepSeek, Gemini)
    and always return plain text content.
    """
    try:
        llm = get_llm(model, api_key, temperature, max_tokens)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

    invoke_fn = getattr(llm, "invoke", None)
    if not callable(invoke_fn):
        raise HTTPException(status_code=500, detail="LLM has no invoke() method")

    try:
        if inspect.iscoroutinefunction(invoke_fn):
            resp = await invoke_fn(messages)
        else:
            loop = asyncio.get_running_loop()
            resp = await loop.run_in_executor(None, lambda: invoke_fn(messages))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"LLM error: {e}")

    return _extract_text(resp)


class MindmapGenerateRequest(BaseModel):
    model: str          # e.g. "openai/gpt-4o-mini" or "groq/llama-3.1-8b"
    api_key: str
    topic: str          # topic or whole text you want to convert into mindmap
    max_tokens: int = 800
    temperature: float = 0.2


class MindmapExplainRequest(BaseModel):
    model: str
    api_key: str
    mindmap: Dict[str, Any]
    question: str | None = None
    max_tokens: int = 800
    temperature: float = 0.2


class MindmapEditRequest(BaseModel):
    model: str
    api_key: str
    mindmap: Dict[str, Any]   # existing mindmap JSON
    instruction: str          # "add more examples to X", "remove node Y", etc.
    max_tokens: int = 800
    temperature: float = 0.2


@app.post("/extract-pdf")
async def extract_pdf(request: Request, file: UploadFile = File(...)) -> Dict[str, str]:
    """
    Accepts a PDF upload and returns its extracted text (concatenated pages).
    """

    cl = request.headers.get("content-length")
    if cl and int(cl) > MAX_FILE_SIZE:
        raise HTTPException(status_code=413, detail="File too large")

    if file.content_type not in ("application/pdf", "application/octet-stream"):
        raise HTTPException(status_code=400, detail="File must be a PDF.")

    data = await file.read()
    try:
        doc = fitz.open(stream=data, filetype="pdf")
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Unable to open PDF: {e}")

    pages: List[str] = []
    for i, page in enumerate(doc, start=1):
        try:
            text = page.get_text("text")
        except Exception:
            text = page.get_text()
        pages.append(text.strip())

    full_text = "\n\n".join(p for p in pages if p)
    
    if len(full_text) > 3000:
        raise HTTPException(status_code=413, detail="File content too large.")

    return JSONResponse({"filename": file.filename, "text": full_text})


@app.post("/extract-image")
async def extract_image(request: Request, file: UploadFile = File(...)) -> Dict[str, str]:
    """
    Accepts an image upload and returns OCR text detected by EasyOCR.
    Supports common image types: jpeg, png, bmp, tiff, webp.
    """
 
    cl = request.headers.get("content-length")
    if cl and int(cl) > MAX_FILE_SIZE:
        raise HTTPException(status_code=413, detail="File too large")

    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="File must be an image.")

    image_bytes = await file.read()
    try:
        # Load image and convert to RGB (EasyOCR expects numpy array)
        img = Image.open(io.BytesIO(image_bytes)).convert("RGB")
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Unable to open image: {e}")

    arr = np.array(img)

    try:
        # detail=0 -> returns list of strings; adjust if you want bounding boxes
        results: List[str] = reader.readtext(arr, detail=0)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"OCR failed: {e}")

    text = "\n".join(results).strip()
 
    if len(text) > 1000:
        raise HTTPException(status_code=413, detail="File content too large.")

    return JSONResponse({"filename": file.filename, "text": text})


@app.post("/mindmap/generate")
async def generate_mindmap(body: MindmapGenerateRequest):
    """
    Generate a tree-style mindmap JSON from a topic or paragraph.

    Schema:

    {
      "id": "root",
      "label": "<root label/topic>",
      "children": [
        {
          "id": "n1",
          "label": "Subtopic",
          "children": [
            {
              "id": "n1a",
              "label": "Detail or sub-subtopic",
              "children": []
            }
          ]
        }
      ]
    }
    """

    system_prompt = """
You are a mindmap generator for an educational app.

You ALWAYS answer with ONLY valid JSON (no markdown, no comments, no backticks).

Target schema (tree):

{
  "id": "root",
  "label": string,
  "children": [
    {
      "id": string,
      "label": string,
      "children": [
        { "id": string, "label": string, "children": [] }
      ]
    }
  ]
}

Before you answer:
1. Silently think step by step about:
   - What is the main topic?
   - 4–8 key subtopics.
   - 1–4 concise details for each subtopic.
2. Organize them into 2–3 levels of depth (root → subtopics → details).
3. Then output ONLY the final JSON in the required schema.
""".strip()

    # --- Few-shot example (small) ---
    example_topic = "Basics of Computer Networks"

    example_assistant = {
        "id": "root",
        "label": "Computer Networks",
        "children": [
            {
                "id": "n1",
                "label": "Key Concepts",
                "children": [
                    { "id": "n1a", "label": "Nodes (hosts, routers, switches)", "children": [] },
                    { "id": "n1b", "label": "Links (wired, wireless)", "children": [] }
                ]
            },
            {
                "id": "n2",
                "label": "Layers (OSI view)",
                "children": [
                    { "id": "n2a", "label": "Physical + Data Link", "children": [] },
                    { "id": "n2b", "label": "Network (IP)", "children": [] },
                    { "id": "n2c", "label": "Transport (TCP/UDP)", "children": [] }
                ]
            }
        ]
    }

    example_user_msg = f"Create a mindmap in the required JSON tree schema for this topic:\n\n{example_topic}"

    user_prompt = f"""
Create a mindmap in the required JSON tree schema for this topic or content:

{body.topic}
""".strip()

    messages = [
        {"role": "system", "content": system_prompt},

        # few-shot pair
        {"role": "user", "content": example_user_msg},
        {"role": "assistant", "content": json.dumps(example_assistant, ensure_ascii=False)},

        # real request
        {"role": "user", "content": user_prompt},
    ]

    reply = await _call_llm(
        model=body.model,
        api_key=body.api_key,
        messages=messages,
        max_tokens=body.max_tokens,
        temperature=body.temperature,
    )

    try:
        mindmap = json.loads(reply)
    except JSONDecodeError:
        cleaned = _extract_json_from_text(reply)
        if not cleaned:
            raise HTTPException(
                status_code=500,
                detail="LLM did not return valid JSON for mindmap.",
            )
        mindmap = json.loads(cleaned)

    if not isinstance(mindmap, dict) or "id" not in mindmap or "label" not in mindmap or "children" not in mindmap:
        raise HTTPException(
            status_code=500,
            detail="Mindmap JSON has unexpected structure.",
        )

    return {"mindmap": mindmap}


@app.post("/mindmap/explain")
async def explain_mindmap(body: MindmapExplainRequest):
    """
    Explain an existing tree-style mindmap to the user in simple language.
    """

    system_prompt = """
You are a tutor who explains mindmaps in a clear, friendly way.

Mindmap schema (tree):

{
  "id": "root",
  "label": string,
  "children": [
    {
      "id": string,
      "label": string,
      "children": [ ... node schema recursively ... ]
    }
  ]
}

Before answering:
1. Silently analyze the tree: root topic, main branches, and important leaves.
2. Plan a logical explanation: overview → main branches → key details.
3. Then write the explanation in Markdown using headings and bullet points.
4. Use simple language, as if teaching a student.

Do NOT modify the given JSON. Only explain it.
""".strip()

    # --- Few-shot example ---
    example_mindmap = {
        "id": "root",
        "label": "Line Codes",
        "children": [
            {
                "id": "lc1",
                "label": "Definition",
                "children": [
                    {
                        "id": "lc1a",
                        "label": "Binary 1s and 0s → electrical pulses (waveforms)",
                        "children": []
                    }
                ]
            },
            {
                "id": "lc2",
                "label": "Major Categories",
                "children": [
                    {
                        "id": "lc2a",
                        "label": "RZ (Return-to-Zero)",
                        "children": []
                    }
                ]
            }
        ]
    }

    example_question = "Explain this to me like I am new to digital communication."

    example_user = (
        "Here is the mindmap JSON:\n\n"
        + json.dumps(example_mindmap, ensure_ascii=False, indent=2)
        + "\n\nUser question:\n"
        + example_question
    )

    example_answer = """
### Overview

This mindmap is about **Line Codes**, which are ways to represent digital 1s and 0s as electrical signals on a transmission line.

### 1. Definition

- Line coding converts binary bits (1s and 0s) into **electrical pulses or waveforms**.
- These coded signals are what actually travel over the wire or channel.

### 2. Major Categories

- One main category mentioned is **RZ (Return-to-Zero)**, where the signal returns to zero within each bit period.
- Other categories could also exist (not fully shown here), and each has different properties for bandwidth, synchronization, and noise performance.
""".strip()

    # Build user content for the real request
    user_content = "Here is the mindmap JSON:\n\n"
    user_content += json.dumps(body.mindmap, ensure_ascii=False, indent=2)

    if body.question:
        user_content += "\n\nUser question:\n" + body.question

    messages = [
        {"role": "system", "content": system_prompt},

        # few-shot example
        {"role": "user", "content": example_user},
        {"role": "assistant", "content": example_answer},

        # real request
        {"role": "user", "content": user_content},
    ]

    explanation = await _call_llm(
        model=body.model,
        api_key=body.api_key,
        messages=messages,
        max_tokens=body.max_tokens,
        temperature=body.temperature,
    )

    return {"explanation": explanation}


@app.post("/mindmap/edit")
async def edit_mindmap(body: MindmapEditRequest):
    """
    Edit an existing tree-style mindmap based on a natural-language instruction.
    Returns the full updated mindmap JSON.
    """

    system_prompt = """
You are a mindmap editor.

Mindmap schema (tree):

{
  "id": string,
  "label": string,
  "children": [
    {
      "id": string,
      "label": string,
      "children": [ ... node schema recursively ... ]
    }
  ]
}

You will receive:
1. An existing mindmap JSON following this schema.
2. An edit instruction from the user.

Before answering:
1. Silently reason step by step:
   - What change is requested? (add, remove, rename, move, etc.)
   - Which node(s) are affected?
   - How should the tree be updated while staying consistent?
2. Apply the change mentally.
3. Then output ONLY the final, fully updated JSON in the same schema.

Rules:
- Keep the schema exactly the same: each node has id, label, children.
- Preserve existing ids for unchanged nodes.
- Return ONLY the final, fully updated JSON in the same schema.
- For new nodes, create unique ids that are consistent with the style of existing ids (e.g. "lc7a", "n5b", etc.).
- Do NOT include explanations, comments, or any text outside the JSON.
""".strip()

    # --- Few-shot example (small edit) ---
    example_original = {
        "id": "root",
        "label": "Line Codes",
        "children": [
            {
                "id": "lc1",
                "label": "Definition",
                "children": []
            }
        ]
    }

    example_instruction = "Add a new child under 'Definition' describing that line codes convert bits into electrical waveforms."

    example_edited = {
        "id": "root",
        "label": "Line Codes",
        "children": [
            {
                "id": "lc1",
                "label": "Definition",
                "children": [
                    {
                        "id": "lc1a",
                        "label": "Convert binary bits (1s and 0s) into electrical waveforms for transmission",
                        "children": []
                    }
                ]
            }
        ]
    }

    example_user = (
        "Existing mindmap JSON:\n\n"
        + json.dumps(example_original, ensure_ascii=False, indent=2)
        + "\n\nEdit instruction:\n"
        + example_instruction
    )

    messages = [
        {"role": "system", "content": system_prompt},

        # few-shot example
        {"role": "user", "content": example_user},
        {"role": "assistant", "content": json.dumps(example_edited, ensure_ascii=False)},

        # real request
        {
            "role": "user",
            "content": (
                "Existing mindmap JSON:\n\n"
                + json.dumps(body.mindmap, ensure_ascii=False, indent=2)
                + "\n\nEdit instruction:\n"
                + body.instruction
            ),
        },
    ]

    reply = await _call_llm(
        model=body.model,
        api_key=body.api_key,
        messages=messages,
        max_tokens=body.max_tokens,
        temperature=body.temperature,
    )

    # --- robust JSON parsing ---
    try:
        updated = json.loads(reply)
    except JSONDecodeError:
        cleaned = _extract_json_from_text(reply)
        if not cleaned:
            raise HTTPException(
                status_code=500,
                detail="LLM did not return valid JSON for edited mindmap.",
            )
        try:
            updated = json.loads(cleaned)
        except JSONDecodeError:
            raise HTTPException(
                status_code=500,
                detail="LLM did not return valid JSON for edited mindmap.",
            )

    if not isinstance(updated, dict) or "id" not in updated or "label" not in updated or "children" not in updated:
        raise HTTPException(
            status_code=500,
            detail="Edited mindmap JSON has unexpected structure.",
        )

    return {"mindmap": updated}



# --- new LLM endpoint ---
app.include_router(llm_router, prefix="/llm")

@app.get("/health")
def health():
    return {"status": "ok", "easyocr_langs": _LANGS, "easyocr_gpu": _use_gpu}
