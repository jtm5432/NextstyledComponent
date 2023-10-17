import React from 'react';
import { StyledButton } from './Button.styles';
/**
 * Button 컴포넌트는 아래와 같은 props를 받습니다.
 * - variant?: 'ok' | 'cancel' - 버튼의 종류 (확인 , 취소)
 * - onClick?: () => void - 버튼 클릭 시 호출되는 함수
 * - children: React.ReactNode - 버튼 내부에 표시할 내용
 */
interface ButtonProps {
    variant?: 'ok' | 'cancel'; // 버튼의 종류 (확인 , 취소)
    onClick?: () => void;
    children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({ variant = 'ok', onClick, children }) => {
    return (
        <StyledButton variant={variant} onClick={onClick}>
            {children}
        </StyledButton>
    );
};

export default Button;
