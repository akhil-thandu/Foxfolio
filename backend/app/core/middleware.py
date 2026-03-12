from fastapi import Request, HTTPException
from fastapi.responses import JSONResponse
from app.core.security import decode_token

UNPROTECTED_ROUTES = [
    "/api/v1/auth/login",
    "/api/v1/auth/refresh",
    "/api/v1/auth/logout",
    "/docs",
    "/openapi.json",
    "/health",
    "/"
]

async def auth_middleware(request: Request, call_next):
    path = request.url.path
    if path == "/" or any(path.startswith(route) for route in UNPROTECTED_ROUTES if route != "/"):
        return await call_next(request)

    auth_header = request.headers.get("Authorization")
    if not auth_header or not auth_header.startswith("Bearer "):
        return JSONResponse(status_code=401, content={"success": False, "error": "Missing access token"})

    token = auth_header.split(" ")[1]
    try:
        payload = decode_token(token)
        if payload.get("type") != "access":
            return JSONResponse(status_code=401, content={"success": False, "error": "Invalid token type"})
        request.state.user = payload
    except Exception:
        return JSONResponse(status_code=401, content={"success": False, "error": "Invalid or expired token"})

    return await call_next(request)
