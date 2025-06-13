from fastapi import APIRouter, HTTPException, Query
from datetime import date, time, datetime
from bson.objectid import ObjectId
from db import board_collection, member_collection
from models import BoardCreateRequest, BoardUpdateRequest, BoardResponse

router = APIRouter()

@router.post("/api/posts", response_model=BoardResponse)
def create_post(req: BoardCreateRequest):
    member = member_collection.find_one({"userId": req.userId})
    if not member:
        raise HTTPException(400, "존재하지 않는 사용자입니다.")
    today = date.today().isoformat()
    exists = board_collection.find_one({
        "title": req.title,
        "writerId": str(member["_id"]),
        "content": req.content,
        "createdDate": today
    })
    if exists:
        raise HTTPException(400, "동일한 내용의 글이 이미 등록되어 있습니다.")
    now = datetime.now()
    board = {
        "title": req.title,
        "content": req.content,
        "writerId": str(member["_id"]),
        "writerNickname": member["nickname"],
        "viewCount": 0,
        "createdDate": now.date().isoformat(),
        "createdTime": now.time().replace(microsecond=0).isoformat(),
        "deleted": False,
        "deletedDate": None,
        "deletedTime": None
    }
    result = board_collection.insert_one(board)
    board["id"] = str(result.inserted_id)
    return BoardResponse(
        id=board["id"],
        title=board["title"],
        content=board["content"],
        writerId=board["writerId"],
        writerNickname=board["writerNickname"],
        viewCount=board["viewCount"],
        createdDate=date.fromisoformat(board["createdDate"]),
        createdTime=time.fromisoformat(board["createdTime"]),
        deleted=board["deleted"],
        deletedDate=None,
        deletedTime=None
    )

@router.get("/api/posts")
def get_posts(
    page: int = Query(0, ge=0),
    size: int = Query(30, ge=1, le=100),
):
    total_elements = board_collection.count_documents({"deleted": False})
    boards = (
        board_collection.find({"deleted": False})
        .sort([("createdDate", -1), ("createdTime", -1)])
        .skip(page * size)
        .limit(size)
    )
    content = []
    for b in boards:
        content.append(BoardResponse(
            id=str(b["_id"]),
            title=b["title"],
            content=b["content"],
            writerId=b["writerId"],
            writerNickname=b["writerNickname"],
            viewCount=b["viewCount"],
            createdDate=date.fromisoformat(b["createdDate"]),
            createdTime=time.fromisoformat(b["createdTime"]),
            deleted=b.get("deleted", False),
            deletedDate=date.fromisoformat(b["deletedDate"]) if b.get("deletedDate") else None,
            deletedTime=time.fromisoformat(b["deletedTime"]) if b.get("deletedTime") else None
        ))
    total_pages = (total_elements + size - 1) // size
    return {
        "content": content,
        "totalPages": total_pages,
        "totalElements": total_elements,
        "page": page,
        "size": size,
    }

@router.get("/api/posts/{id}", response_model=BoardResponse)
def get_post(id: str):
    b = board_collection.find_one({"_id": ObjectId(id)})
    if not b or b.get("deleted"):
        raise HTTPException(404, "게시글을 찾을 수 없습니다.")
    board_collection.update_one({"_id": ObjectId(id)}, {"$inc": {"viewCount": 1}})
    b["viewCount"] += 1
    return BoardResponse(
        id=str(b["_id"]),
        title=b["title"],
        content=b["content"],
        writerId=b["writerId"],
        writerNickname=b["writerNickname"],
        viewCount=b["viewCount"],
        createdDate=date.fromisoformat(b["createdDate"]),
        createdTime=time.fromisoformat(b["createdTime"]),
        deleted=b.get("deleted", False),
        deletedDate=date.fromisoformat(b["deletedDate"]) if b.get("deletedDate") else None,
        deletedTime=time.fromisoformat(b["deletedTime"]) if b.get("deletedTime") else None
    )

@router.put("/api/posts/{id}", response_model=BoardResponse)
def update_post(id: str, req: BoardUpdateRequest):
    # 게시글 존재 확인
    b = board_collection.find_one({"_id": ObjectId(id)})
    if not b or b.get("deleted"):
        raise HTTPException(404, "게시글을 찾을 수 없습니다.")

    # 작성자 확인
    member = member_collection.find_one({"userId": req.userId})
    if not member:
        raise HTTPException(404, "작성자를 찾을 수 없습니다.")

    if str(member["_id"]) != b["writerId"]:
        raise HTTPException(403, "작성자만 수정할 수 있습니다.")

    # 게시글 수정
    board_collection.update_one(
        {"_id": ObjectId(id)},
        {"$set": {
            "title": req.title,
            "content": req.content,
        }}
    )
    # 수정된 게시글 다시 조회
    updated = board_collection.find_one({"_id": ObjectId(id)})
    return BoardResponse(
        id=str(updated["_id"]),
        title=updated["title"],
        content=updated["content"],
        writerId=updated["writerId"],
        writerNickname=updated["writerNickname"],
        viewCount=updated["viewCount"],
        createdDate=date.fromisoformat(updated["createdDate"]),
        createdTime=time.fromisoformat(updated["createdTime"]),
        deleted=updated.get("deleted", False),
        deletedDate=date.fromisoformat(updated["deletedDate"]) if updated.get("deletedDate") else None,
        deletedTime=time.fromisoformat(updated["deletedTime"]) if updated.get("deletedTime") else None
    )

@router.delete("/api/posts/{id}")
def delete_post(id: str):
    b = board_collection.find_one({"_id": ObjectId(id)})
    if not b or b.get("deleted"):
        raise HTTPException(404, "게시글을 찾을 수 없습니다.")
    now = datetime.now()
    board_collection.update_one(
        {"_id": ObjectId(id)},
        {"$set": {
            "deleted": True,
            "deletedDate": now.date().isoformat(),
            "deletedTime": now.time().replace(microsecond=0).isoformat()
        }}
    )
    return {"message": "삭제되었습니다."}

