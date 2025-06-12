import React, {useState, useEffect} from "react";
import {useNavigate, useParams, Link} from "react-router-dom";
import {API_URLS} from "../api/urls";
import {useAuth} from "../context/AuthContext";
import "../styles/Board.css";

interface PostFormState {
    title: string;
    content: string;
    userId: string;
}

interface Props {
    isEdit?: boolean;
}

const PostForm: React.FC<Props> = ({isEdit}) => {
    const {id} = useParams<{ id: string }>();
    const navigate = useNavigate();
    const {user} = useAuth();

    const [form, setForm] = useState<PostFormState>({
        title: "",
        content: "",
        userId: user?.userId ?? "",
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (user) {
            setForm(f => ({...f, userId: user.userId}));
        }
    }, [user]);

    useEffect(() => {
        if (isEdit && id && user) {
            setError(null);
            fetch(`${API_URLS.POST(id)}/edit`)
                .then(res => {
                    if (!res.ok) throw new Error("글 정보를 불러오지 못했습니다.");
                    return res.json();
                })
                .then(data => setForm({
                    title: data.title,
                    content: data.content,
                    userId: user.userId,
                }))
                .catch(err => {
                    setError(err.message || "글 정보를 불러오지 못했습니다.");
                });
        }
    }, [isEdit, id, user]);

    useEffect(() => {
        if (error) {
            const timer = setTimeout(() => setError(null), 2000);
            return () => clearTimeout(timer);
        }
    }, [error]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setForm({...form, [e.target.name]: e.target.value});
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (isSubmitting) return;
        setIsSubmitting(true);
        setError(null);
        try {
            let res: Response;
            if (isEdit && id) {
                res = await fetch(API_URLS.POST(id), {
                    method: "PUT",
                    headers: {"Content-Type": "application/json"},
                    body: JSON.stringify(form),
                });
            } else {
                res = await fetch(API_URLS.POSTS, {
                    method: "POST",
                    headers: {"Content-Type": "application/json"},
                    body: JSON.stringify(form),
                });
            }
            if (!res.ok) {
                const data = await res.json().catch(() => ({}));
                throw new Error(data.message || "저장에 실패했습니다.");
            }
            navigate("/");
        } catch (err) {
            setError((err as Error).message || "저장 중 오류가 발생했습니다.");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!user) {
        return (
            <main className="board-form-container board-form-container--detail">
                <div className="error-message">로그인 후 글쓰기가 가능합니다.</div>
                <Link to="/" className="board-btn" style={{marginTop: 24}}>목록으로</Link>
            </main>
        );
    }

    return (
        <>
            <main className="board-form-container board-form-container--detail">
                <h2 className="board-form-title board-form-title--mb">
                    {isEdit ? "글 수정" : "글 작성"}
                </h2>
                {error && <div className="error-message" style={{marginBottom: 16}}>{error}</div>}
                <form onSubmit={handleSubmit} className="board-form">
                    <label className="board-form-label" htmlFor="title">
                        제목
                        <input
                            className="board-form-input"
                            id="title"
                            name="title"
                            value={form.title}
                            onChange={handleChange}
                            required
                            placeholder="제목을 입력하세요"
                        />
                    </label>
                    <label className="board-form-label board-content-label" htmlFor="content">
                        내용
                        <textarea
                            className="board-form-textarea"
                            id="content"
                            name="content"
                            value={form.content}
                            onChange={handleChange}
                            required
                            rows={8}
                            placeholder="내용을 입력하세요"
                            maxLength={2000}
                        />
                    </label>
                    <div className="board-form-btn-group board-form-btn-group--right">
                        <button type="submit" className="board-btn" disabled={isSubmitting}>
                            {isEdit ? "수정" : "작성"}
                        </button>
                        <Link to="/" className="board-btn cancel">
                            취소
                        </Link>
                    </div>
                </form>
            </main>
        </>
    );
};

export default PostForm;