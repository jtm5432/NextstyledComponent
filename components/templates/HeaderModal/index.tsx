import React from 'react';
/**
 * Modal 컴포넌트는 아래와 같은 props를 받습니다.
 * - isOpen: boolean - 모달의 열림 여부
 * - onClose: () => void - 모달을 닫을 때 호출되는 함수
 * - children: React.ReactNode - 모달 내부에 표시할 내용 컴포넌트
 */
interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    children: React.ReactNode;
}

const HeaderModal: React.FC<ModalProps> = ({ isOpen, onClose, children }) => {
    if (!isOpen) return null;
    
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-black opacity-50" onClick={onClose}></div>

            <div className="z-10 p-6 bg-white rounded shadow-lg">
                {children}
            </div>
        </div>
    );
}

export default HeaderModal;
