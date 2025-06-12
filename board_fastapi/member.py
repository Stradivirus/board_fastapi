from fastapi import APIRouter, HTTPException, Query
from datetime import date
from db import member_collection
from models import MemberJoinRequest, MemberLoginRequest, MemberResponse
import bcrypt

router = APIRouter()

@router.post("/api/member/join", response_model=MemberResponse)
def join(req: MemberJoinRequest):
    if member_collection.find_one({"userId": req.userId}):
        raise HTTPException(400, "이미 사용 중인 아이디입니다.")
    if member_collection.find_one({"nickname": req.nickname}):
        raise HTTPException(400, "이미 사용 중인 닉네임입니다.")
    if member_collection.find_one({"email": req.email}):
        raise HTTPException(400, "이미 사용 중인 이메일입니다.")
    # 비밀번호 해싱
    hashed_pw = bcrypt.hashpw(req.password.encode("utf-8"), bcrypt.gensalt())
    member = {
        "userId": req.userId,
        "nickname": req.nickname,
        "password": hashed_pw.decode("utf-8"),
        "email": req.email,
        "joinedAt": date.today().isoformat()
    }
    result = member_collection.insert_one(member)
    member["id"] = str(result.inserted_id)
    return MemberResponse(
        id=member["id"],
        userId=member["userId"],
        nickname=member["nickname"],
        email=member["email"],
        joinedAt=date.fromisoformat(member["joinedAt"])
    )

@router.post("/api/member/login", response_model=MemberResponse)
def login(req: MemberLoginRequest):
    member = member_collection.find_one({"userId": req.userId})
    if not member or not bcrypt.checkpw(req.password.encode("utf-8"), member["password"].encode("utf-8")):
        raise HTTPException(401, "아이디 또는 비밀번호가 올바르지 않습니다.")
    return MemberResponse(
        id=str(member["_id"]),
        userId=member["userId"],
        nickname=member["nickname"],
        email=member["email"],
        joinedAt=date.fromisoformat(member["joinedAt"])
    )

@router.get("/api/member/check/{field}")
def check_duplicate(field: str, value: str = Query(...)):
    if field not in ("userId", "nickname", "email"):
        raise HTTPException(400, "잘못된 필드입니다.")
    exists = member_collection.find_one({field: value}) is not None
    return exists