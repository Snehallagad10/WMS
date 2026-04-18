from fastapi import APIRouter, HTTPException

router = APIRouter(prefix="/auth", tags=["Auth"])


@router.post("/login")
async def login(data: dict):
    try:
        username = data.get("username")
        password = data.get("password")

        print("LOGIN HIT:", username)

        # TEMP DEMO LOGIN (avoid DB crash)
        if username == "admin" and password == "admin":
            return {"message": "Login success", "token": "demo-token"}

        raise HTTPException(status_code=401, detail="Invalid credentials")

    except Exception as e:
        print("LOGIN ERROR:", str(e))
        raise HTTPException(status_code=500, detail=str(e))
