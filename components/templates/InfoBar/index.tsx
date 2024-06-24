// components/InfoBar.tsx
import React, { useEffect, useRef } from 'react';
import { useRecoilState } from 'recoil';
import { infoBarState } from '../../../app/state/InfoModal';
import styled from 'styled-components';


const InfoBarContainer = styled.div<{ isOpen: boolean }>`
  position: fixed;
  right: 0;
  top: 0;
  height: 100%;
  width: 300px;
  background-color: rgba(0, 0, 0, 0.5); // Black with higher transparency
  color: white; // Ensuring text is visible on black background
  box-shadow: -2px 0 5px rgba(0,0,0,0.3);
  z-index: 1000;
  overflow-y: auto;
  transition: transform 0.3s ease-in-out;
  transform: ${props => props.isOpen ? 'translateX(0)' : 'translateX(110%)'};
`;

const InfoBarContent = styled.div`
  padding: 20px;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  background: none;
  border: none;
  color: white; // Ensuring the close button is visible on black background
  font-size: 1.5em;
  cursor: pointer;
`;

const Overlay = styled.div<{ isOpen: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.2); // Black with transparency
  display: ${props => props.isOpen ? 'block' : 'none'};
  z-index: 999;
`;


const InfoBar: React.FC = () => {
  const [infoBar, setInfoBar] = useRecoilState(infoBarState);
  const infoBarRef = useRef<HTMLDivElement>(null);
  console.log('infoBar',infoBar);
  const closeInfoBar = () => {
    setInfoBar({ ...infoBar, isOpen: false });
  };

  const handleOverlayClick = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (infoBarRef.current && !infoBarRef.current.contains(event.target as Node)) {
      closeInfoBar();
    }
  };

  return (
    <>
      <Overlay isOpen={infoBar.isOpen} onClick={handleOverlayClick} />
      <InfoBarContainer isOpen={infoBar.isOpen} ref={infoBarRef}>
        <CloseButton onClick={closeInfoBar}>&times;</CloseButton>
        <InfoBarContent>
          {infoBar.content}
        </InfoBarContent>
      </InfoBarContainer>
    </>
  );
};

export default InfoBar;
