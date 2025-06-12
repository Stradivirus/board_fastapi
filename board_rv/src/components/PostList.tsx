import React, {useEffect, useState} from "react";
import {Link} from "react-router-dom";
import type {Post} from "../types/Post";
import {API_URLS} from "../api/urls";
import {formatDate} from "../utils/formatDate";
import {useAuth} from "../context/AuthContext";
import "../styles/Board.css";

const PAGE_SIZE = 30;

const PostList: React.FC = () => {
    const [posts, setPosts] = useState<Post[]>([]);
    const [totalPages, setTotalPages] = useState(1);
    const [totalElements, setTotalElements] = useState(0);
    const [page, setPage] = useState(0);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const {user} = useAuth();

    useEffect(() => {
        setIsLoading(true);
        setError(null);
        fetch(`${API_URLS.POSTS}?page=${page}&size=${PAGE_SIZE}`)
            .then(res => {
                if (!res.ok) throw new Error("게시글을 불러오지 못했습니다.");
                return res.json();
            })
            .then(data => {
                setPosts(data.content || []);
                setTotalPages(data.totalPages || 1);
                setTotalElements(data.totalElements || 0);
            })
            .catch(err => {
                setPosts([]);
                setTotalPages(1);
                setTotalElements(0);
                setError(err.message || "게시글을 불러오는 중 오류가 발생했습니다.");
            })
            .finally(() => setIsLoading(false));
    }, [page]);

    const handlePrev = () => setPage(p => Math.max(0, p - 1));
    const handleNext = () => setPage(p => Math.min(totalPages - 1, p + 1));

    return (
        <>
            <main className="board-main">
                <div className="board-title-bar">
                    <h2>게시글 목록</h2>
                    {user ? (
                        <Link to="/new">
                            <button className="board-write-btn">글쓰기</button>
                        </Link>
                    ) : (
                        <button className="board-write-btn" disabled style={{opacity: 0.5, cursor: "not-allowed"}}>
                            글쓰기 (로그인 필요)
                        </button>
                    )}
                </div>
                {error && <div className="error-message" style={{marginBottom: 16}}>{error}</div>}
                <table className="board-table">
                    <thead>
                    <tr>
                        <th style={{width: "7%"}}>번호</th>
                        <th style={{width: "45%"}}>제목</th>
                        <th>작성자</th>
                        <th>작성일</th>
                        <th>작성시간</th>
                        <th>조회수</th>
                    </tr>
                    </thead>
                    <tbody>
                    {isLoading ? (
                        <tr>
                            <td colSpan={6} style={{textAlign: 'center', color: '#aaa'}}>
                                불러오는 중...
                            </td>
                        </tr>
                    ) : (posts || []).length === 0 ? (
                        <tr>
                            <td colSpan={6} style={{textAlign: 'center', color: '#aaa'}}>
                                게시글이 없습니다.
                            </td>
                        </tr>
                    ) : (posts || []).map((post, idx) => {
                        // 글번호: 전체 글 개수에서 현재 페이지, 인덱스만큼 빼서 역순으로 표시
                        const displayNumber = totalElements - (page * PAGE_SIZE) - idx;
                        const {date, time} = formatDate(post.createdDate, post.createdTime);
                        return (
                            <tr key={post.id}>
                                <td className="board-post-id">{displayNumber}</td>
                                <td>
                                    <Link
                                        to={`/posts/${post.id}`}
                                        className="board-post-title-link"
                                    >
                                        {post.title}
                                    </Link>
                                </td>
                                <td className="board-post-author">{post.writerNickname || "-"}</td>
                                <td className="board-post-date">{date}</td>
                                <td className="board-post-date">{time}</td>
                                <td className="board-post-views">{post.viewCount}</td>
                            </tr>
                        );
                    })}
                    </tbody>
                </table>
                <div className="board-pagination">
                    <button
                        onClick={handlePrev}
                        disabled={page === 0}
                    >이전
                    </button>
                    <span>페이지 {page + 1} / {totalPages}</span>
                    <button
                        onClick={handleNext}
                        disabled={page + 1 >= totalPages}
                    >다음
                    </button>
                </div>
            </main>
        </>
    );
};

export default PostList;