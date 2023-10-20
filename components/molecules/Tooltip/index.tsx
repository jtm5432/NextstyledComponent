import React from 'react';
import TooltipStyled from './tooltip.styels';
/**
 * @description 툴팁 컴포넌트
 * @param {string} text 툴팁에 표시할 텍스트
 * @param {React.ReactNode} children 툴팁을 표시할 컴포넌트
 */
interface TooltipProps {
  text: string;
  children: React.ReactNode;
}

const Tooltip: React.FC<{ text: string, children: React.ReactNode }> = ({ text, children }) => (
    <TooltipStyled.TooltipContainer>
      <TooltipStyled.TooltipWrapper>
        {children}
        <TooltipStyled.TooltipText>{text}</TooltipStyled.TooltipText>
      </TooltipStyled.TooltipWrapper>
    </TooltipStyled.TooltipContainer>
  );


export default Tooltip;
