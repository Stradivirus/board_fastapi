from pydantic import BaseModel, EmailStr
from datetime import date, time
from typing import Optional

class MemberJoinRequest(BaseModel):
    userId: str
    nickname: str
    password: str
    email: EmailStr

class MemberLoginRequest(BaseModel):
    userId: str
    password: str

class MemberResponse(BaseModel):
    id: str
    userId: str
    nickname: str
    email: EmailStr
    joinedAt: date

class BoardCreateRequest(BaseModel):
    title: str
    content: str
    userId: str

class BoardResponse(BaseModel):
    id: str
    title: str
    content: str
    writerId: str
    writerNickname: str
    viewCount: int
    createdDate: date
    createdTime: time
    deleted: Optional[bool] = False
    deletedDate: Optional[date] = None
    deletedTime: Optional[time] = None