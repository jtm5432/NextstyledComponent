import React from 'react';
import { StyledButton } from './Button.styles';

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
