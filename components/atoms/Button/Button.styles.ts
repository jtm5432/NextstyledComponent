import styled from 'styled-components';
/**
 * Button component props
 */
interface ButtonProps {
    variant?: 'ok' | 'cancel'; // 버튼의 종류 (확인 , 취소)
}

export const StyledButton = styled.button<ButtonProps>`
    background-color: ${props => 
        props.variant === 'ok' ? 'blue' :
        props.variant === 'cancel' ? 'grey' :
        'red'
    };
    color: white;

`;
