// Navbar.tsx 파일
import React, { useState, useEffect } from 'react';
import Styled from './Navbar.styles'; // Styled-components의 스타일링 파일을 가져옴
import Icon from '../../atoms/Icon';
import StyledIcon from './NavbarIcon.styels';
import { iconsData } from '../../../app/IconData';
import Tooltip from '../../molecules/Tooltip'; // Tooltip 컴포넌트를 가져옴
import { LayoutsProps } from '../../../types/WidgetGridTypes';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

/**
 * 대시보드 좌측 navbar
 */

const Navbar: React.FC<{
    setGridLayout: LayoutsProps["setGridLayout"];
    savedData: Record<string, {
        gridLayout?: any; title: string, description: string, selectedIconName?: string
    }>
}> = ({ savedData, setGridLayout }) => {

    const [currentIndex, setCurrentIndex] = useState(0);
    const [isNavbarMinimized, setIsNavbarMinimized] = useState(true);

    const toggleNavbar = () => {
    //console.log('isNavbarMinimized',isNavbarMinimized)
      setIsNavbarMinimized((prev) => !prev);
    };
    const handleItemClickWithGridLayout = (data) => {
        // data에 gridLayout 정보가 있는 경우

        if (data.gridLayout) {
            const parsedGridLayout = JSON.parse(data.gridLayout);
            // parsedGridLayout을 사용하여 gridLayout을 업데이트
            setGridLayout(parsedGridLayout);
        }
        // 그 외에는 다른 처리 수행
    };
    console.log('savedDatasavedData', savedData)
    /**
     * 3초마다 navbar 아이템 변경
     */
    // useEffect(() => {
    //     const interval = setInterval(() => {
    //         const dataKeys = Object.keys(savedData);
    //         const nextIndex = (currentIndex + 1) % dataKeys.length;
    //         const nextData = savedData[dataKeys[nextIndex]];
    //         setCurrentIndex(nextIndex);

    //         // data에 gridLayout 정보가 있는 경우에만 처리
    //         if (nextData.gridLayout) {
    //             const parsedGridLayout = JSON.parse(nextData.gridLayout);
    //             setGridLayout(parsedGridLayout);
    //         }
    //     }, 3000); // 3초마다 변경

    //     return () => {
    //         clearInterval(interval); // 컴포넌트가 언마운트될 때 interval 정리
    //     };
    // }, [savedData, setGridLayout, currentIndex]);
    return (
          <Styled.Navbar key={isNavbarMinimized.toString()}>
             <div className="icon" onClick={toggleNavbar}>
                {isNavbarMinimized ? <Icon src={FaChevronRight} alt="확대"/> : <Icon src = {FaChevronLeft} alt = "축소" />}
            </div>
            {Object.values(savedData).map((data, index) => (

                <Styled.NavbarItem key={index} onClick={() => handleItemClickWithGridLayout(data)}>

                    {data.selectedIconName && (
                        <StyledIcon>
                             <Tooltip text={data.description}>
                            <Icon
                                src={iconsData[data.selectedIconName].src}
                                alt="selected-icon"
                            />
                            </Tooltip>
                        </StyledIcon>
                    )}
                    <div style={{ flex: 1 }}>
                        <Tooltip text={data.description}>
                            <h3 style={{ margin: '0', verticalAlign: 'middle' }}>{data.title}</h3> {/* 제목의 margin을 0으로 설정하여 중앙 정렬 */}
                        </Tooltip>

                    </div>

                </Styled.NavbarItem>

            ))}
        </Styled.Navbar>
    );
};

export default Navbar;