import React, {useState} from "react";
import "../styles/Board.css";
import Modal from "./Modal";
import AuthForm from "./AuthForm";
import {useAuth} from "../context/AuthContext";

const BoardHeader: React.FC = () => {
    const {isLoggedIn, user, logout} = useAuth();
    const [modalOpen, setModalOpen] = useState(false);
    const [authMode, setAuthMode] = useState<"login" | "register">("login");

    const openModal = (mode: "login" | "register") => {
        setAuthMode(mode);
        setModalOpen(true);
    };

    const handleProfileClick = () => {
        // 추후 마이페이지/프로필 기능 연결
        alert("프로필 기능은 추후 추가됩니다.");
    };

    return (
        <header
            className="board-header board-header--mb"
            style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
            }}
        >
            <div>
                <h1 className="board-header__title">Spring Board</h1>
                <p className="board-header__desc">
                    자유롭게 글을 작성하고 소통하는 공간입니다.
                </p>
            </div>
            <div className="board-header__profile">
                {isLoggedIn ? (
                    <>
                        <button
                            className="board-btn profile-btn"
                            style={{marginRight: 12}}
                            onClick={handleProfileClick}
                        >
                            {user?.nickname}님
                        </button>
                        <button className="board-btn" onClick={logout}>
                            로그아웃
                        </button>
                    </>
                ) : (
                    <>
                        <button
                            className="board-btn"
                            onClick={() => openModal("login")}
                            style={{marginRight: 10}}
                        >
                            로그인
                        </button>
                        <button className="board-btn" onClick={() => openModal("register")}>
                            회원가입
                        </button>
                    </>
                )}
            </div>
            <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
                <AuthForm mode={authMode} onSuccess={() => setModalOpen(false)}/>
            </Modal>
        </header>
    );
};

export default BoardHeader;
