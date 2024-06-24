import React from 'react';
import styled from 'styled-components';

const HeaderContainer = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px;
    background-color: #f5f5f5;
    border-bottom: 1px solid #ddd;
`;

const Title = styled.h3`
    margin: 0;
    font-size: 1.2em;
`;

const Actions = styled.div`
    display: flex;
    align-items: center;
`;

const ActionButton = styled.button`
    background: none;
    border: none;
    margin-left: 5px;
    cursor: pointer;
    font-size: 1.2em;
`;

interface HeaderRowProps {
    title: string;
    onInfoClick: () => void;
}

const HeaderRow: React.FC<HeaderRowProps> = ({ title, onInfoClick }) => (
    <HeaderContainer>
        <Title>{title}</Title>
        <Actions>
            <ActionButton onClick={onInfoClick}>ℹ️</ActionButton>
        </Actions>
    </HeaderContainer>
);

export default HeaderRow;
