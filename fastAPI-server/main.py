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
    model: str  
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
          "relation": "relation-word",
          "children": [
            {
              "id": "n1a",
              "label": "Detail or sub-subtopic",
              "relation": "relation-word",
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
      "relation": string,   # 1–2 word arrow label describing relationship from parent to child
      "children": [
        { "id": string, "label": string, "relation": string, "children": [] }
      ]
    }
  ]
}

Before you answer:
1. Silently think step by step about:
   - What is the main topic?
   - 4–8 key subtopics.
   - 1–4 concise details for each subtopic.
   - For each child node choose a 1–2 word relationship label (e.g., "uses", "contains", "is a", "helps", "requires", "explains").
2. Organize them into 2–3 levels of depth (root → subtopics → details).
3. Then output ONLY the final JSON.
""".strip()

    # --- Few-shot examples (two examples) ---
    example_topic_1 = "Basics of Computer Networks"

    example_assistant_1 = {
        "id": "root",
        "label": "Computer Networks",
        "children": [
            {
                "id": "n1",
                "label": "Key Concepts",
                "relation": "covers",
                "children": [
                    { "id": "n1a", "label": "Nodes (hosts, routers, switches)", "relation": "are", "children": [] },
                    { "id": "n1b", "label": "Links (wired, wireless)", "relation": "connect", "children": [] }
                ]
            },
            {
                "id": "n2",
                "label": "Layers (OSI view)",
                "relation": "organizes",
                "children": [
                    { "id": "n2a", "label": "Physical + Data Link", "relation": "include", "children": [] },
                    { "id": "n2b", "label": "Network (IP)", "relation": "routes", "children": [] },
                    { "id": "n2c", "label": "Transport (TCP/UDP)", "relation": "ensures", "children": [] }
                ]
            }
        ]
    }

    example_topic_2 = "Introduction to Machine Learning"

    # Bigger / wider example for second few-shot
    example_assistant_2 = {
        "id": "root",
        "label": "Machine Learning",
        "children": [
            {
                "id": "m1",
                "label": "Learning Types",
                "relation": "includes",
                "children": [
                    { "id": "m1a", "label": "Supervised Learning", "relation": "uses", "children": [
                        { "id": "m1a1", "label": "Regression", "relation": "predicts", "children": [] },
                        { "id": "m1a2", "label": "Classification", "relation": "labels", "children": [] }
                    ]},
                    { "id": "m1b", "label": "Unsupervised Learning", "relation": "finds", "children": [
                        { "id": "m1b1", "label": "Clustering", "relation": "groups", "children": [] },
                        { "id": "m1b2", "label": "Dimensionality Reduction", "relation": "reduces", "children": [] }
                    ]},
                    { "id": "m1c", "label": "Reinforcement Learning", "relation": "trains", "children": [
                        { "id": "m1c1", "label": "Agent-Environment", "relation": "interacts", "children": [] }
                    ]}
                ]
            },
            {
                "id": "m2",
                "label": "Algorithms",
                "relation": "provides",
                "children": [
                    { "id": "m2a", "label": "Linear Models (Linear/Logistic)", "relation": "fit", "children": [] },
                    { "id": "m2b", "label": "Tree-based (Decision Trees, RF)", "relation": "split", "children": [] },
                    { "id": "m2c", "label": "SVM", "relation": "separates", "children": [] },
                    { "id": "m2d", "label": "Neural Networks", "relation": "approximate", "children": [] }
                ]
            },
            {
                "id": "m3",
                "label": "Model Evaluation",
                "relation": "measures",
                "children": [
                    { "id": "m3a", "label": "Metrics (Accuracy, RMSE)", "relation": "use", "children": [] },
                    { "id": "m3b", "label": "Validation (Cross-val)", "relation": "prevents", "children": [] },
                    { "id": "m3c", "label": "Bias-Variance Tradeoff", "relation": "balances", "children": [] }
                ]
            },
            {
                "id": "m4",
                "label": "Data",
                "relation": "requires",
                "children": [
                    { "id": "m4a", "label": "Feature Engineering", "relation": "creates", "children": [] },
                    { "id": "m4b", "label": "Data Cleaning", "relation": "fixes", "children": [] },
                    { "id": "m4c", "label": "Datasets (Train/Test/Val)", "relation": "split", "children": [] }
                ]
            },
            {
                "id": "m5",
                "label": "Deployment",
                "relation": "enables",
                "children": [
                    { "id": "m5a", "label": "Model Serving", "relation": "delivers", "children": [] },
                    { "id": "m5b", "label": "Monitoring", "relation": "tracks", "children": [] },
                    { "id": "m5c", "label": "Versioning", "relation": "controls", "children": [] }
                ]
            }
        ]
    }

    example_user_msg_1 = f"Create a mindmap in the required JSON tree schema for this topic:\n\n{example_topic_1}"
    example_user_msg_2 = f"Create a mindmap in the required JSON tree schema for this topic:\n\n{example_topic_2}"

    user_prompt = f"""
Create a mindmap in the required JSON tree schema for this topic or content:

{body.topic}
""".strip()

    messages = [
        {"role": "system", "content": system_prompt},

        # few-shot pair 1
        {"role": "user", "content": example_user_msg_1},
        {"role": "assistant", "content": json.dumps(example_assistant_1, ensure_ascii=False)},

        # few-shot pair 2 (larger/wider example)
        {"role": "user", "content": example_user_msg_2},
        {"role": "assistant", "content": json.dumps(example_assistant_2, ensure_ascii=False)},

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
      "relation": string,    # OPTIONAL: a 1-2 word arrow label describing relationship from parent to this child
      "children": [ ... node schema recursively ... ]
    }
  ]
}

Before answering:
1. Silently analyze the tree: root topic, main branches, relationships (the "relation" field on children), and important leaves.
2. Plan a logical explanation: overview → main branches → key details. When a child node has a "relation" field, briefly incorporate that 1–2 word relationship into the explanation (for example: "Layer X — routes network traffic").
3. Then write the explanation as plain text. Do NOT use Markdown, headings, bold, italics, bullets using asterisks, or other Markdown markers (no '#', '*', '```', or '**'). Use simple paragraphs and plain hyphenated lists where helpful.
4. Use simple language, as if teaching a student.

Do NOT modify the given JSON. Only explain it.
""".strip()

    # --- Few-shot examples (three examples: two minimal, one bigger/wider) ---
    # Example 1 (minimal)
    example_mindmap_1 = {
        "id": "root",
        "label": "HTTP Basics",
        "children": [
            {
                "id": "h1",
                "label": "Request-Response",
                "relation": "follows",
                "children": []
            },
            {
                "id": "h2",
                "label": "Methods",
                "relation": "include",
                "children": [
                    {"id": "h2a", "label": "GET", "relation": "retrieves", "children": []},
                    {"id": "h2b", "label": "POST", "relation": "submits", "children": []}
                ]
            }
        ]
    }
    example_question_1 = "Explain this as if I'm new to web development."
    example_user_1 = (
        "Here is the mindmap JSON:\n\n"
        + json.dumps(example_mindmap_1, ensure_ascii=False, indent=2)
        + "\n\nUser question:\n"
        + example_question_1
    )
    example_answer_1 = """
Overview

This mindmap is about HTTP Basics, the core idea behind web communication.

Request-Response
- HTTP works as a request-response model: the client sends a request and the server replies. (Relation: follows)

Methods
- The Methods branch lists common HTTP methods. (Relation: include)
- GET — used to retrieve data from the server. (Relation: retrieves)
- POST — used to submit data to the server (for example, form submissions). (Relation: submits)

Quick tip
- Remember: GET is for reading, POST is for sending or creating.
""".strip()

    # Example 2 (minimal)
    example_mindmap_2 = {
        "id": "root",
        "label": "Git Basics",
        "children": [
            {
                "id": "g1",
                "label": "Workflow",
                "relation": "follows",
                "children": [
                    {"id": "g1a", "label": "Clone", "relation": "creates", "children": []},
                    {"id": "g1b", "label": "Commit", "relation": "records", "children": []},
                    {"id": "g1c", "label": "Push", "relation": "sends", "children": []}
                ]
            }
        ]
    }
    example_question_2 = "Explain this to a beginner who has never used version control."
    example_user_2 = (
        "Here is the mindmap JSON:\n\n"
        + json.dumps(example_mindmap_2, ensure_ascii=False, indent=2)
        + "\n\nUser question:\n"
        + example_question_2
    )
    example_answer_2 = """
Overview

This mindmap covers Git Basics, a common version control workflow.

Workflow
- The Workflow node outlines typical steps. (Relation: follows)
- Clone — creates a local copy of a repository from a remote. (Relation: creates)
- Commit — records your changes locally with a message. (Relation: records)
- Push — sends commits from your local repo to the remote repository. (Relation: sends)

Quick tip
- Think of clone → commit → push as: copy, save locally, then upload.
""".strip()

    # Example 3 (bigger / wider)
    example_mindmap_3 = {
        "id": "root",
        "label": "Machine Learning Overview",
        "children": [
            {
                "id": "m1",
                "label": "Types",
                "relation": "includes",
                "children": [
                    {"id": "m1a", "label": "Supervised", "relation": "uses", "children": [
                        {"id": "m1a1", "label": "Regression", "relation": "predicts", "children": []},
                        {"id": "m1a2", "label": "Classification", "relation": "labels", "children": []}
                    ]},
                    {"id": "m1b", "label": "Unsupervised", "relation": "finds", "children": [
                        {"id": "m1b1", "label": "Clustering", "relation": "groups", "children": []},
                        {"id": "m1b2", "label": "Dimensionality Reduction", "relation": "reduces", "children": []}
                    ]},
                    {"id": "m1c", "label": "Reinforcement", "relation": "trains", "children": []}
                ]
            },
            {
                "id": "m2",
                "label": "Pipeline",
                "relation": "comprises",
                "children": [
                    {"id": "m2a", "label": "Data Collection", "relation": "gathers", "children": []},
                    {"id": "m2b", "label": "Preprocessing", "relation": "cleans", "children": []},
                    {"id": "m2c", "label": "Modeling", "relation": "fits", "children": []},
                    {"id": "m2d", "label": "Evaluation", "relation": "measures", "children": []},
                    {"id": "m2e", "label": "Deployment", "relation": "serves", "children": []}
                ]
            },
            {
                "id": "m3",
                "label": "Algorithms",
                "relation": "provide",
                "children": [
                    {"id": "m3a", "label": "Linear Models", "relation": "fit", "children": []},
                    {"id": "m3b", "label": "Decision Trees", "relation": "split", "children": []},
                    {"id": "m3c", "label": "Neural Networks", "relation": "approximate", "children": []}
                ]
            }
        ]
    }
    example_question_3 = "Explain this as an overview for someone learning ML for the first time."
    example_user_3 = (
        "Here is the mindmap JSON:\n\n"
        + json.dumps(example_mindmap_3, ensure_ascii=False, indent=2)
        + "\n\nUser question:\n"
        + example_question_3
    )
    example_answer_3 = """
Overview

This mindmap gives a broad overview of Machine Learning, covering types, pipeline, and algorithms.

1. Types (includes)
- Supervised (Relation: uses) — learning with labeled data.
  - Regression (Relation: predicts) — predicts numeric values.
  - Classification (Relation: labels) — assigns categories.
- Unsupervised (Relation: finds) — discovering patterns without labels.
  - Clustering (Relation: groups) — groups similar items.
  - Dimensionality Reduction (Relation: reduces) — simplifies features.
- Reinforcement (Relation: trains) — learning by interacting with an environment using rewards.

2. Pipeline (comprises)
- Data Collection (Relation: gathers) — gather raw data.
- Preprocessing (Relation: cleans) — clean and prepare data.
- Modeling (Relation: fits) — fit algorithms to data.
- Evaluation (Relation: measures) — measure performance with metrics.
- Deployment (Relation: serves) — serve the trained model to users.

3. Algorithms (provide)
- Linear Models (Relation: fit) — simple and interpretable.
- Decision Trees (Relation: split) — split data by features.
- Neural Networks (Relation: approximate) — approximate complex functions.

Final note
- The short relation labels act like small arrow labels that summarize how nodes relate.
""".strip()

    # Build user content for the real request
    user_content = "Here is the mindmap JSON:\n\n"
    user_content += json.dumps(body.mindmap, ensure_ascii=False, indent=2)

    if body.question:
        user_content += "\n\nUser question:\n" + body.question

    messages = [
        {"role": "system", "content": system_prompt},

        # few-shot example 1 (minimal)
        {"role": "user", "content": example_user_1},
        {"role": "assistant", "content": example_answer_1},

        # few-shot example 2 (minimal)
        {"role": "user", "content": example_user_2},
        {"role": "assistant", "content": example_answer_2},

        # few-shot example 3 (bigger / wider)
        {"role": "user", "content": example_user_3},
        {"role": "assistant", "content": example_answer_3},

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

# --- new LLM endpoint ---
app.include_router(llm_router, prefix="/llm")

@app.get("/health")
def health():
    return {"status": "ok", "easyocr_langs": _LANGS, "easyocr_gpu": _use_gpu}
