import React, {useState} from "react";
import type {Member} from "../types/Member";
import {useAuth} from "../context/AuthContext";
import {API_URLS} from "../api/urls";
import "../styles/modal.css";

interface AuthFormProps {
    mode: "login" | "register";
    onSuccess?: (member: Member) => void;
}

const AuthForm: React.FC<AuthFormProps> = ({mode, onSuccess}) => {
    const {login} = useAuth();
    const [form, setForm] = useState({
        userId: "",
        nickname: "",
        password: "",
        email: "",
    });
    const [passwordConfirm, setPasswordConfirm] = useState("");
    const [result, setResult] = useState<string>("");
    const [validation, setValidation] = useState({
        userId: "",
        nickname: "",
        email: "",
        passwordConfirm: "",
    });
    const [loginError, setLoginError] = useState<string>("");

    // 입력값 변경 핸들러
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.target;
        if (name === "passwordConfirm") {
            setPasswordConfirm(value);
            setValidation((prev) => ({
                ...prev,
                passwordConfirm: value !== form.password ? "비밀번호가 일치하지 않습니다" : "",
            }));
        } else {
            setForm({...form, [name]: value});
        }
    };

    // 입력 필드 포커스 아웃 시 중복/유효성 체크
    const handleBlur = async (e: React.FocusEvent<HTMLInputElement>) => {
        const {name, value} = e.target;

        if (name === "passwordConfirm") {
            setValidation((prev) => ({
                ...prev,
                passwordConfirm: value !== form.password ? "비밀번호가 일치하지 않습니다" : "",
            }));
            return;
        }

        if (mode !== "register") return;

        if (["userId", "nickname", "email"].includes(name)) {
            if (value.trim() === "") {
                setValidation((prev) => ({
                    ...prev,
                    [name]: "",
                }));
                return;
            }
            try {
                const res = await fetch(`${API_URLS.MEMBER_CHECK}/${name}?value=${value}`);
                if (res.ok) {
                    const isDuplicate = await res.json();
                    setValidation((prev) => ({
                        ...prev,
                        [name]: isDuplicate
                            ? "이미 사용 중입니다"
                            : "사용 가능합니다",
                    }));
                } else {
                    setValidation((prev) => ({
                        ...prev,
                        [name]: "확인 실패",
                    }));
                }
            } catch {
                setValidation((prev) => ({
                    ...prev,
                    [name]: "오류 발생",
                }));
            }
        }
    };

    // 1초 대기 함수
    const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

    // 폼 제출 핸들러
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (mode === "register" && form.password !== passwordConfirm) {
            setResult("비밀번호가 일치하지 않습니다.");
            return;
        }
        setResult("로딩 중...");
        setLoginError(""); // 로그인 에러 초기화
        try {
            const url = mode === "login" ? API_URLS.MEMBER_LOGIN : API_URLS.MEMBER_JOIN;
            const payload = mode === "login"
                ? {userId: form.userId, password: form.password}
                : form;
            const res = await fetch(url, {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify(payload),
            });
            if (res.ok) {
                const data = await res.json();
                setResult(`${mode === "login" ? "로그인" : "회원가입"} 성공!`);
                await delay(1000);

                login(
                    data.token || "dummy-token",
                    {id: data.id, userId: data.userId, nickname: data.nickname}
                );

                if (onSuccess) onSuccess(data);
            } else {
                const error = await res.text();
                if (mode === "login") {
                    setLoginError("아이디 또는 비밀번호가 올바르지 않습니다.");
                    setResult("");
                } else {
                    setResult(`회원가입 실패: ${error}`);
                }
            }
        } catch (err) {
            setResult(
                `${mode === "login" ? "로그인" : "회원가입"} 오류: ${(err as Error).message}`
            );
        }
    };

    // 입력 필드 렌더링 함수
    const renderInput = (
        name: string,
        type: string,
        placeholder: string,
        value: string,
        required = true,
        minLength?: number
    ) => (
        <div>
            <input
                className="modal-input"
                name={name}
                type={type}
                placeholder={placeholder}
                value={value}
                onChange={handleChange}
                onBlur={handleBlur}
                required={required}
                minLength={minLength}
            />
            {validation[name as keyof typeof validation] && (
                <div
                    className={`validation ${
                        validation[name as keyof typeof validation] === "사용 가능합니다"
                            ? "valid"
                            : "invalid"
                    }`}
                    style={{
                        color:
                            validation[name as keyof typeof validation] === "사용 가능합니다"
                                ? "green"
                                : "red",
                    }}
                >
                    {validation[name as keyof typeof validation]}
                </div>
            )}
        </div>
    );

    return (
        <form className="modal-form" onSubmit={handleSubmit}>
            <h3 className="modal-message" style={{marginBottom: 12}}>
                {mode === "login" ? "로그인" : "회원가입"}
            </h3>
            {renderInput("userId", "text", "아이디", form.userId)}
            {mode === "register" && renderInput("nickname", "text", "닉네임", form.nickname)}
            {renderInput("password", "password", "비밀번호", form.password, true, 8)}
            {/* 로그인 모드에서만 비밀번호 아래에 에러 표시 */}
            {mode === "login" && loginError && (
                <div className="validation invalid" style={{color: "red", marginBottom: 8}}>
                    {loginError}
                </div>
            )}
            {mode === "register" && renderInput("passwordConfirm", "password", "비밀번호 확인", passwordConfirm, true, 8)}
            {mode === "register" && renderInput("email", "email", "이메일", form.email)}
            <button className="board-btn" type="submit">
                {mode === "login" ? "로그인" : "회원가입"}
            </button>
            <div className="modal-result">{result}</div>
        </form>
    );
};

export default AuthForm;