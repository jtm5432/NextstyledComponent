import React from 'react';
import TooltipStyled from './tooltip.styels';
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
