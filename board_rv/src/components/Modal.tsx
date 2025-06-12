import React from "react";
import "../styles/modal.css";

interface ModalProps {
    open: boolean;
    onClose: () => void;
    children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({open, onClose, children}) => {
    if (!open) return null;
    return (
        <div className="modal-backdrop" onClick={onClose}>
            <div className="modal" onClick={e => e.stopPropagation()}>
                {children}
                <div className="modal-btn-group">
                    <button className="board-btn cancel" onClick={onClose}>닫기</button>
                </div>
            </div>
        </div>
    );
};

export default Modal;
