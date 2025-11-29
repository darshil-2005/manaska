import sys
import os
import types
import io
import json
import asyncio
import numpy as np
import pytest
from fastapi.testclient import TestClient
from fastapi.exceptions import HTTPException as FastAPIHTTPException

# Path setup

TESTS_DIR = os.path.dirname(__file__)
PROJECT_ROOT = os.path.abspath(os.path.join(TESTS_DIR, "..", ".."))
SRC_DIR = os.path.join(PROJECT_ROOT, "fastAPI-server")

if SRC_DIR not in sys.path:
    sys.path.insert(0, SRC_DIR)

# Fake heavy deps BEFORE importing main / llm_endpoint


# Fake easyocr with a lightweight Reader
fake_easyocr_mod = types.ModuleType("easyocr")


class _FakeReader:
    def __init__(self, langs, gpu=False):
        self._langs = langs
        self._gpu = gpu

    def readtext(self, arr, detail=0):
        # default: empty, tests override via monkeypatch when needed
        return []


fake_easyocr_mod.Reader = lambda langs, gpu=False: _FakeReader(langs, gpu)
sys.modules["easyocr"] = fake_easyocr_mod

# Fake fitz (PyMuPDF)
fake_fitz_mod = types.ModuleType("fitz")
fake_fitz_mod.open = lambda stream, filetype=None: None
sys.modules["fitz"] = fake_fitz_mod

# Fake PIL.Image
fake_PIL = types.ModuleType("PIL")
fake_Image_mod = types.ModuleType("PIL.Image")


def _fake_image_open(stream):
    class Dummy:
        def convert(self, mode):
            # Something numpy.array can accept
            return np.zeros((2, 2, 3), dtype=np.uint8)

    return Dummy()


fake_Image_mod.open = _fake_image_open
fake_PIL.Image = fake_Image_mod
sys.modules["PIL"] = fake_PIL
sys.modules["PIL.Image"] = fake_Image_mod

# Fake langchain_* so llm_endpoint imports cleanly even without real deps
class _DummyLLMBase:
    def __init__(self, **kwargs):
        self.kwargs = kwargs


fake_openai = types.ModuleType("langchain_openai")
fake_openai.ChatOpenAI = _DummyLLMBase
sys.modules["langchain_openai"] = fake_openai

fake_groq = types.ModuleType("langchain_groq")
fake_groq.ChatGroq = _DummyLLMBase
sys.modules["langchain_groq"] = fake_groq

fake_gemini = types.ModuleType("langchain_google_genai")
fake_gemini.ChatGoogleGenerativeAI = _DummyLLMBase
sys.modules["langchain_google_genai"] = fake_gemini

# Import app modules (after fakes)

import importlib

main = importlib.import_module("main")
llm_endpoint = importlib.import_module("llm_endpoint")

client = TestClient(main.app)

# Helpers

class DummyPage:
    def __init__(self, text):
        self._text = text

    def get_text(self, *args, **kwargs):
        return self._text


class DummyDoc:
    def __init__(self, pages_texts):
        self._pages = [DummyPage(t) for t in pages_texts]

    def __iter__(self):
        return iter(self._pages)


class DummyLLMSync:
    """Simple sync LLM-like object with invoke(messages)"""

    def __init__(self, return_value):
        self._return = return_value

    def invoke(self, messages):
        return self._return


class DummyLLMAsync:
    """Coroutine-style LLM invoke"""

    def __init__(self, return_value):
        self._return = return_value

    async def invoke(self, messages):
        return self._return

# Basic health

def test_health():
    r = client.get("/health")
    assert r.status_code == 200
    data = r.json()
    assert data["status"] == "ok"
    assert "easyocr_langs" in data
    assert "easyocr_gpu" in data

    
# /extract-pdf tests

def test_extract_pdf_success(monkeypatch):
    # Use DummyDoc with two pages
    monkeypatch.setattr(main, "fitz", main.fitz)
    monkeypatch.setattr(
        main.fitz, "open", lambda stream, filetype=None: DummyDoc(["Page 1", "Page 2"])
    )

    pdf_bytes = b"%PDF-FAKE\n"
    files = {"file": ("test.pdf", io.BytesIO(pdf_bytes), "application/pdf")}
    r = client.post("/extract-pdf", files=files)
    assert r.status_code == 200
    j = r.json()
    assert j["filename"] == "test.pdf"
    assert "Page 1" in j["text"] and "Page 2" in j["text"]


def test_extract_pdf_too_large_content(monkeypatch):
    # Content > 3000 chars should 413
    large_text = "x" * 4000
    monkeypatch.setattr(
        main.fitz, "open", lambda stream, filetype=None: DummyDoc([large_text])
    )
    pdf_bytes = b"%PDF-FAKE\n"
    files = {"file": ("big.pdf", io.BytesIO(pdf_bytes), "application/pdf")}
    r = client.post("/extract-pdf", files=files)
    assert r.status_code == 413


def test_extract_pdf_invalid_content_type():
    files = {"file": ("test.txt", io.BytesIO(b"hello"), "text/plain")}
    r = client.post("/extract-pdf", files=files)
    assert r.status_code == 400
    assert "File must be a PDF" in r.json()["detail"]


def test_extract_pdf_too_large_header():
    pdf_bytes = b"%PDF-FAKE\n"
    files = {"file": ("big.pdf", io.BytesIO(pdf_bytes), "application/pdf")}
    headers = {"content-length": str(main.MAX_FILE_SIZE + 1)}
    r = client.post("/extract-pdf", files=files, headers=headers)
    assert r.status_code == 413


def test_extract_pdf_open_error(monkeypatch):
    monkeypatch.setattr(main, "fitz", main.fitz)

    def _bad_open(stream, filetype=None):
        raise Exception("bad pdf")

    monkeypatch.setattr(main.fitz, "open", _bad_open)

    pdf_bytes = b"%PDF-FAKE\n"
    files = {"file": ("bad.pdf", io.BytesIO(pdf_bytes), "application/pdf")}
    r = client.post("/extract-pdf", files=files)
    assert r.status_code == 400
    assert "Unable to open PDF" in r.json()["detail"]


def test_extract_pdf_get_text_fallback(monkeypatch):
    # get_text("text") fails → fallback to get_text()
    class FallbackPage:
        def get_text(self, arg=None):
            if arg == "text":
                raise Exception("primary")
            return "fallback text"

    class FallbackDoc:
        def __iter__(self):
            return iter([FallbackPage()])

    monkeypatch.setattr(main, "fitz", main.fitz)
    monkeypatch.setattr(
        main.fitz, "open", lambda stream, filetype=None: FallbackDoc()
    )

    pdf_bytes = b"%PDF-FAKE\n"
    files = {"file": ("test.pdf", io.BytesIO(pdf_bytes), "application/pdf")}
    r = client.post("/extract-pdf", files=files)
    assert r.status_code == 200
    assert "fallback text" in r.json()["text"]


# /extract-image tests


def test_extract_image_success(monkeypatch):
    # Monkeypatch PIL.Image.open to return a small RGB image
    class DummyImage:
        def convert(self, mode):
            return np.zeros((4, 4, 3), dtype=np.uint8)

    monkeypatch.setattr(main, "Image", main.Image)
    monkeypatch.setattr(main.Image, "open", lambda stream: DummyImage())

    # EasyOCR result
    monkeypatch.setattr(
        main.reader, "readtext", lambda arr, detail=0: ["Hello", "World"]
    )

    img_bytes = b"\x89PNG\r\n\x1a\nFAKE"
    files = {"file": ("img.png", io.BytesIO(img_bytes), "image/png")}
    r = client.post("/extract-image", files=files)
    assert r.status_code == 200
    j = r.json()
    assert "Hello" in j["text"]
    assert "World" in j["text"]


def test_extract_image_too_large_text(monkeypatch):
    class DummyImage:
        def convert(self, mode):
            return np.zeros((2, 2, 3), dtype=np.uint8)

    monkeypatch.setattr(main.Image, "open", lambda stream: DummyImage())

    long_list = ["x" * 200] * 6  # 1200 chars
    monkeypatch.setattr(main.reader, "readtext", lambda arr, detail=0: long_list)

    img_bytes = b"FAKEIMAGE"
    files = {"file": ("bigtext.png", io.BytesIO(img_bytes), "image/png")}
    r = client.post("/extract-image", files=files)
    assert r.status_code == 413


def test_extract_image_invalid_content_type():
    img_bytes = b"notimage"
    files = {"file": ("test.pdf", io.BytesIO(img_bytes), "application/pdf")}
    r = client.post("/extract-image", files=files)
    assert r.status_code == 400
    assert "File must be an image" in r.json()["detail"]


def test_extract_image_too_large_header():
    img_bytes = b"fake"
    files = {"file": ("img.png", io.BytesIO(img_bytes), "image/png")}
    headers = {"content-length": str(main.MAX_FILE_SIZE + 1)}
    r = client.post("/extract-image", files=files, headers=headers)
    assert r.status_code == 413


def test_extract_image_open_error(monkeypatch):
    def _bad_open(stream):
        raise Exception("broken")

    monkeypatch.setattr(main, "Image", main.Image)
    monkeypatch.setattr(main.Image, "open", _bad_open)

    img_bytes = b"fake"
    files = {"file": ("img.png", io.BytesIO(img_bytes), "image/png")}
    r = client.post("/extract-image", files=files)
    assert r.status_code == 400
    assert "Unable to open image" in r.json()["detail"]


def test_extract_image_ocr_error(monkeypatch):
    class DummyImage:
        def convert(self, mode):
            return np.zeros((2, 2, 3), dtype=np.uint8)

    monkeypatch.setattr(main, "Image", main.Image)
    monkeypatch.setattr(main.Image, "open", lambda stream: DummyImage())

    def _bad_read(arr, detail=0):
        raise Exception("ocr fail")

    monkeypatch.setattr(main.reader, "readtext", _bad_read)

    img_bytes = b"fake"
    files = {"file": ("img.png", io.BytesIO(img_bytes), "image/png")}
    r = client.post("/extract-image", files=files)
    assert r.status_code == 500
    assert "OCR failed" in r.json()["detail"]


# /mindmap/generate tests


def test_mindmap_generate_success(monkeypatch):
    fake_mindmap = {
        "id": "root",
        "label": "Test Topic",
        "children": [{"id": "n1", "label": "Sub1", "relation": "is", "children": []}],
    }

    def fake_get_llm(model, api_key, temperature, max_tokens):
        return DummyLLMSync(json.dumps(fake_mindmap))

    monkeypatch.setattr(main, "get_llm", fake_get_llm)

    payload = {"model": "openai-test", "api_key": "sk-test", "topic": "Anything"}
    r = client.post("/mindmap/generate", json=payload)
    assert r.status_code == 200
    j = r.json()
    assert "mindmap" in j and isinstance(j["mindmap"], dict)
    assert j["mindmap"]["label"] == "Test Topic"


def test_mindmap_generate_invalid_json_from_llm(monkeypatch):
    def fake_get_llm(model, api_key, temperature, max_tokens):
        return DummyLLMSync("this is not json and has no braces")

    monkeypatch.setattr(main, "get_llm", fake_get_llm)

    payload = {"model": "openai-test", "api_key": "sk-test", "topic": "Anything"}
    r = client.post("/mindmap/generate", json=payload)
    assert r.status_code == 500


def test_mindmap_generate_json_in_fence(monkeypatch):
    inner = {"id": "root", "label": "From Fence", "children": []}
    fenced = "Here is your mindmap:\n```json\n" + json.dumps(inner) + "\n```"

    def fake_get_llm(model, api_key, temperature, max_tokens):
        return DummyLLMSync(fenced)

    monkeypatch.setattr(main, "get_llm", fake_get_llm)

    payload = {"model": "openai-test", "api_key": "sk-test", "topic": "Anything"}
    r = client.post("/mindmap/generate", json=payload)
    assert r.status_code == 200
    assert r.json()["mindmap"]["label"] == "From Fence"


def test_mindmap_generate_bad_structure(monkeypatch):
    bad = {"foo": "bar"}

    def fake_get_llm(model, api_key, temperature, max_tokens):
        return DummyLLMSync(json.dumps(bad))

    monkeypatch.setattr(main, "get_llm", fake_get_llm)

    payload = {"model": "openai-test", "api_key": "sk-test", "topic": "Anything"}
    r = client.post("/mindmap/generate", json=payload)
    assert r.status_code == 500
    assert "unexpected structure" in r.json()["detail"]


# /mindmap/explain tests


def test_mindmap_explain_success(monkeypatch):
    explanation_text = "This is a friendly explanation of the provided mindmap."

    def fake_get_llm(model, api_key, temperature, max_tokens):
        return DummyLLMSync(explanation_text)

    monkeypatch.setattr(main, "get_llm", fake_get_llm)

    mindmap = {"id": "root", "label": "X", "children": []}
    payload = {
        "model": "openai-test",
        "api_key": "sk-test",
        "mindmap": mindmap,
        "question": "Explain",
    }
    r = client.post("/mindmap/explain", json=payload)
    assert r.status_code == 200
    j = r.json()
    assert "explanation" in j and explanation_text in j["explanation"]


# /llm/invoke endpoint tests


def test_llm_invoke_endpoint(monkeypatch):
    fake_response = {"choices": [{"message": {"content": "hi from llm"}}]}

    class FakeLLM:
        def invoke(self, messages):
            return fake_response

    monkeypatch.setattr(
        llm_endpoint,
        "get_llm",
        lambda model, api_key, temperature, max_tokens: FakeLLM(),
    )

    payload = {
        "model": "openai-test",
        "api_key": "sk-test",
        "messages": [{"role": "user", "content": "Hello"}],
    }
    r = client.post("/llm/invoke", json=payload)
    assert r.status_code == 200
    j = r.json()
    assert j["reply"] == "hi from llm"
    assert j["model"] == "openai-test"


def test_llm_invoke_invalid_model(monkeypatch):
    def bad_get_llm(model, api_key, temperature, max_tokens):
        raise Exception("unsupported")

    monkeypatch.setattr(llm_endpoint, "get_llm", bad_get_llm)

    payload = {
        "model": "bad-model",
        "api_key": "sk-test",
        "messages": [{"role": "user", "content": "Hello"}],
    }
    r = client.post("/llm/invoke", json=payload)
    assert r.status_code == 400
    assert "unsupported" in r.json()["detail"]


def test_llm_invoke_no_invoke(monkeypatch):
    class NoInvoke:
        pass

    monkeypatch.setattr(llm_endpoint, "get_llm", lambda *a, **k: NoInvoke())

    payload = {
        "model": "openai-test",
        "api_key": "sk-test",
        "messages": [{"role": "user", "content": "Hello"}],
    }
    r = client.post("/llm/invoke", json=payload)
    assert r.status_code == 500
    assert "invoke() method" in r.json()["detail"]


def test_llm_invoke_async_llm(monkeypatch):
    class AsyncLLM:
        async def invoke(self, messages):
            return {"choices": [{"message": {"content": "async hi"}}]}

    monkeypatch.setattr(llm_endpoint, "get_llm", lambda *a, **k: AsyncLLM())

    payload = {
        "model": "openai-test",
        "api_key": "sk-test",
        "messages": [{"role": "user", "content": "Hello"}],
    }
    r = client.post("/llm/invoke", json=payload)
    assert r.status_code == 200
    assert r.json()["reply"] == "async hi"


def test_llm_invoke_llm_error(monkeypatch):
    class ErrorLLM:
        def invoke(self, messages):
            raise RuntimeError("boom")

    monkeypatch.setattr(llm_endpoint, "get_llm", lambda *a, **k: ErrorLLM())

    payload = {
        "model": "openai-test",
        "api_key": "sk-test",
        "messages": [{"role": "user", "content": "Hello"}],
    }
    r = client.post("/llm/invoke", json=payload)
    assert r.status_code == 500
    assert "LLM error: boom" in r.json()["detail"]

# Direct unit tests: main._extract_json_from_text


def test_extract_json_from_text_variants():
    # Empty / no JSON
    assert main._extract_json_from_text("") is None

    # Already valid JSON
    s = '{"a":1}'
    assert main._extract_json_from_text(s) == s

    # JSON in ```json ... ``` fences
    fenced = "x```json\n{\"b\":2}\n```y"
    out = main._extract_json_from_text(fenced)
    assert json.loads(out)["b"] == 2

    # JSON embedded in text with braces
    embedded = "prefix {\"c\":3} suffix"
    out2 = main._extract_json_from_text(embedded)
    assert json.loads(out2)["c"] == 3

    # No JSON at all
    assert main._extract_json_from_text("no json here") is None


# Direct unit tests: main._call_llm
# (wrapped with asyncio.run so no extra async plugins needed)


def test_call_llm_get_llm_error(monkeypatch):
    def bad_get_llm(*a, **k):
        raise Exception("bad model")

    monkeypatch.setattr(main, "get_llm", bad_get_llm)

    with pytest.raises(FastAPIHTTPException) as exc:
        asyncio.run(main._call_llm("model", "key", []))

    assert exc.value.status_code == 400


def test_call_llm_no_invoke(monkeypatch):
    class NoInvoke:
        pass

    monkeypatch.setattr(main, "get_llm", lambda *a, **k: NoInvoke())

    with pytest.raises(FastAPIHTTPException) as exc:
        asyncio.run(main._call_llm("model", "key", []))

    assert exc.value.status_code == 500
    assert "invoke() method" in exc.value.detail


def test_call_llm_async_success(monkeypatch):
    class AsyncLLM:
        async def invoke(self, messages):
            return "ok"

    monkeypatch.setattr(main, "get_llm", lambda *a, **k: AsyncLLM())

    result = asyncio.run(
        main._call_llm("model", "key", [{"role": "user", "content": "hi"}])
    )
    assert result == "ok"


def test_call_llm_invoke_error(monkeypatch):
    class ErrorLLM:
        def invoke(self, messages):
            raise RuntimeError("boom")

    monkeypatch.setattr(main, "get_llm", lambda *a, **k: ErrorLLM())

    with pytest.raises(FastAPIHTTPException) as exc:
        asyncio.run(
            main._call_llm("model", "key", [{"role": "user", "content": "hi"}])
        )

    assert exc.value.status_code == 500
    assert "LLM error: boom" in exc.value.detail


# Direct unit tests: llm_endpoint.get_llm and _extract_text


def test_llm_get_llm_variants():
    # openai*
    llm_openai = llm_endpoint.get_llm("openai-gpt", "sk", 0.3, 100)
    assert isinstance(llm_openai, llm_endpoint.ChatOpenAI)
    assert llm_openai.kwargs["model"] == "openai-gpt"
    assert llm_openai.kwargs["openai_api_key"] == "sk"

    # groq*
    llm_groq = llm_endpoint.get_llm("groq-mixtral", "sk2", 0.1, 50)
    assert isinstance(llm_groq, llm_endpoint.ChatGroq)
    assert llm_groq.kwargs["groq_api_key"] == "sk2"

    # deepseek*
    llm_deepseek = llm_endpoint.get_llm("deepseek-chat", "sk3", 0.2, 200)
    assert isinstance(llm_deepseek, llm_endpoint.ChatOpenAI)
    assert llm_deepseek.kwargs["openai_api_base"] == "https://api.deepseek.com/v1"

    # gemini*
    llm_gemini = llm_endpoint.get_llm("gemini-1.5", "sk4", 0.4, 300)
    assert isinstance(llm_gemini, llm_endpoint.ChatGoogleGenerativeAI)
    assert llm_gemini.kwargs["google_api_key"] == "sk4"

    # unsupported
    with pytest.raises(Exception):
        llm_endpoint.get_llm("other-model", "sk", 0.1, 10)


def test_extract_text_variants():
    et = llm_endpoint._extract_text

    # None
    assert et(None) == ""

    # direct string
    assert et("hello") == "hello"

    # object with .content
    class RespObj:
        def __init__(self):
            self.content = "from attr"

    assert et(RespObj()) == "from attr"

    # dict with choices -> message -> content
    resp_choice = {"choices": [{"message": {"content": "from message"}}]}
    assert et(resp_choice) == "from message"

    # dict with choices -> text
    resp_choice_text = {"choices": [{"text": "from text"}]}
    assert et(resp_choice_text) == "from text"

    # dict with direct content
    resp_content = {"content": "direct"}
    assert et(resp_content) == "direct"

    # fallback to str
    other = {"foo": "bar"}
    out = et(other)
    assert "foo" in out and "bar" in out
