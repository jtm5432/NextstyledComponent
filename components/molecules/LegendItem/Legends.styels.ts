// styles.ts
import styled from 'styled-components';

interface LegendItemProps {
    fontSize: string;
}

export const LegendContainer = styled.div`
    width: 100%; // 필요에 따라 조절 가능
`;

export const LegendItem = styled.div<LegendItemProps>`
    font-size: ${props => props.fontSize};
    display: flex;
    align-items: center;
    gap: 0.5rem; // 아이콘과 텍스트 간의 간격
`;

export const ColorIcon = styled.span<{ color: string }>`
    display: inline-block;
    width: 12px;
    height: 12px;
    border-radius: 50%;  // 원 모양을 만들기 위한 스타일
    background-color: ${({ color }) => color};
    margin-right: 5px;  // 라벨과의 간격
`;