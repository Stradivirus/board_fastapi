from pydantic import BaseModel, EmailStr, constr
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
    title: constr(max_length=100)    # 제목 최대 100자
    content: constr(max_length=2000) # 내용 최대 2000자
    userId: str

class BoardUpdateRequest(BaseModel):
    title: constr(max_length=100)
    content: constr(max_length=2000)
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