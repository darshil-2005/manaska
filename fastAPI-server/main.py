# main.py
from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from typing import Dict, List
import io
import os
from llm_endpoint import router as llm_router

# PDF extraction
import fitz  # PyMuPDF

# Image OCR (EasyOCR)
import numpy as np
from PIL import Image
import easyocr

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


@app.post("/extract-pdf")
async def extract_pdf(file: UploadFile = File(...)) -> Dict[str, str]:
    """
    Accepts a PDF upload and returns its extracted text (concatenated pages).
    """
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
    return JSONResponse({"filename": file.filename, "text": full_text})


@app.post("/extract-image")
async def extract_image(file: UploadFile = File(...)) -> Dict[str, str]:
    """
    Accepts an image upload and returns OCR text detected by EasyOCR.
    Supports common image types: jpeg, png, bmp, tiff, webp.
    """
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
    return JSONResponse({"filename": file.filename, "text": text})

# --- new LLM endpoint ---
app.include_router(llm_router, prefix="/llm")

@app.get("/health")
def health():
    return {"status": "ok", "easyocr_langs": _LANGS, "easyocr_gpu": _use_gpu}
