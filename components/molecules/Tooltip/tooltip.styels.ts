import React from 'react';
import styled from 'styled-components';

/**
 * Tooltip 컴포넌트 스타일 정의
 * - TooltipContainer: 툴팁 컨테이너
 * - TooltipText: 툴팁 텍스트
 * - TooltipWrapper: 툴팁 컨테이너와 텍스트를 감싸는 컨테이너
 */
const TooltipContainer = styled.div`
  position: relative;
  display: inline-block;
`;

const TooltipText = styled.span`
  visibility: hidden;
  width: auto;
  background-color: #333;
  color: #fff;
  text-align: center;
  border-radius: 6px;
  padding: 5px;
  white-space: nowrap; /* 텍스트 줄 바꿈 금지 */

  position: fixed;
  z-index: 1;
  top: auto; /* 툴팁을 아래로 내리기 위해 100%로 설정 */
  bottom: auto;
  margin-top: 5px; /* 원하는 간격으로 조절 */
  left: 2%;
  margin-left: 0px;
  opacity: 0;
  transition: opacity 0.2s;
`;

const TooltipWrapper = styled.div`
  
  &:hover ${TooltipText} {
    visibility: visible;
    opacity: 1;
  }
`;


const TooltipStyled = {
  TooltipContainer :TooltipContainer,
  TooltipText: TooltipText,
  TooltipWrapper: TooltipWrapper    
}

export default TooltipStyled;