const API_BASE = "http://localhost:8000/api";

export const API_URLS = {
    POSTS: `${API_BASE}/posts`,
    POST: (id: string) => `${API_BASE}/posts/${id}`,
    MEMBER_LOGIN: `${API_BASE}/member/login`,
    MEMBER_JOIN: `${API_BASE}/member/join`,
    MEMBER_CHECK: `${API_BASE}/member/check`,
};