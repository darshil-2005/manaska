# llm_endpoint.py
from fastapi import APIRouter, HTTPException, Request
import asyncio
import inspect
import json

from langchain_openai import ChatOpenAI
from langchain_groq import ChatGroq
from langchain_google_genai import ChatGoogleGenerativeAI

router = APIRouter()

# LLM FACTORY
def get_llm(model: str, api_key: str, temperature: float, max_tokens: int):
    if model.startswith("groq"):
        return ChatGroq(
            model=model.replace("groq/", ""),
            groq_api_key=api_key,
            temperature=temperature,
            max_tokens=max_tokens,
        )

    if model.startswith("openai"):
        return ChatOpenAI(
            model=model.replace("openai/", ""),
            openai_api_key=api_key,
            temperature=temperature,
            max_tokens=max_tokens,
        )

    if model.startswith("deepseek"):
        return ChatOpenAI(
            model=model.replace("deepseek/", ""),
            openai_api_key=api_key,
            openai_api_base="https://api.deepseek.com/v1",
            temperature=temperature,
            max_tokens=max_tokens,
        )

    if model.startswith("gemini"):
        return ChatGoogleGenerativeAI(
            model=model,
            google_api_key=api_key,
        )

    raise Exception("Unsupported model prefix.")

# TEXT EXTRACTOR
def _extract_text(resp):
    if resp is None:
        return ""

    # direct
    if isinstance(resp, str):
        return resp

    # objects with .content
    if hasattr(resp, "content") and isinstance(resp.content, str):
        return resp.content

    # dict-like (OpenAI / Groq)
    if isinstance(resp, dict):
        # choices → message → content
        choices = resp.get("choices")
        if isinstance(choices, list) and choices:
            msg = choices[0].get("message") or {}
            if isinstance(msg, dict) and "content" in msg:
                return msg["content"]
            if "text" in choices[0]:
                return choices[0]["text"]

        # direct content
        if "content" in resp and isinstance(resp["content"], str):
            return resp["content"]

    # fallback
    return str(resp)

# ENDPOINT
@router.post("/invoke")
async def invoke(request: Request):
    data = await request.json()

    model = data["model"]
    api_key = data["api_key"]
    messages = data["messages"]
    max_tokens = data.get("max_tokens", 512)
    temperature = data.get("temperature", 0.2)

    try:
        llm = get_llm(model, api_key, temperature, max_tokens)
    except Exception as e:
        raise HTTPException(400, str(e))

    invoke_fn = getattr(llm, "invoke", None)
    if not callable(invoke_fn):
        raise HTTPException(500, "LLM has no invoke() method")

    # run async or sync invoke properly
    try:
        if inspect.iscoroutinefunction(invoke_fn):
            resp = await invoke_fn(messages)
        else:
            loop = asyncio.get_running_loop()
            resp = await loop.run_in_executor(None, lambda: invoke_fn(messages))
    except Exception as e:
        raise HTTPException(500, f"LLM error: {e}")

    reply = _extract_text(resp)

    return {"reply": reply, "model": model}