// Navbar.tsx 파일
import React, { useState, useEffect } from 'react';
import Styled from './Navbar.styles'; // Styled-components의 스타일링 파일을 가져옴
import Icon from '../../atoms/Icon';
import StyledIcon from './NavbarIcon.styels';
import { iconsData } from '../../../app/IconData';
import Tooltip from '../../molecules/Tooltip'; // Tooltip 컴포넌트를 가져옴
import { LayoutsProps } from '../../../types/WidgetGridTypes';
import { FaSave } from 'react-icons/fa'; // "저장" 아이콘을 위한 아이콘

import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { GridLayout } from '../../../types/dashboardTypes';
/**
 * 대시보드 좌측 navbar
 */

const Navbar: React.FC<{
    setGridLayout: LayoutsProps["setGridLayout"];
    savedData: Record<string, {
        id?: string; gridLayout?: any; title: string, description: string, selectedIconName?: string
    }>
    onSave: (id: string) => void; // onSave의 타입을 수정
}> = ({ savedData, setGridLayout, onSave }) => {

    const [currentIndex, setCurrentIndex] = useState(0);
    const [isNavbarMinimized, setIsNavbarMinimized] = useState(true);
    const [selectedId, setSelectedId] = useState<string>(''); // 선택된 아이콘의 이름을 저장
    const toggleNavbar = () => {
        //console.log('isNavbarMinimized',isNavbarMinimized)
        setIsNavbarMinimized((prev) => !prev);
    };


    const convertAndValidateGridLayoutItem = (item: any): GridLayout | null => {
        const { i, x, y, w, h } = item;
    
        // Convert to numbers and validate
        const convertedX = Number(x);
        const convertedY = Number(y);
        const convertedW = Number(w);
        const convertedH = Number(h);
    
        if (!isNaN(convertedX) && !isNaN(convertedY) && !isNaN(convertedW) && !isNaN(convertedH)) {
            return { i, x: convertedX, y: convertedY, w: convertedW, h: convertedH };
        }
        return null; 
    };
    
    const handleItemClickWithGridLayout = (data: any) => {
        if (data.gridLayout) {
            console.log('handleItemClickWithGridLayout', data.gridLayout);
            
            const convertedGridLayout = data.gridLayout.map(item => convertAndValidateGridLayoutItem(item)).filter(item => item !== null);
    
            if (convertedGridLayout.length === data.gridLayout.length) {
                setGridLayout(convertedGridLayout);
                setSelectedId(data.id);
            } else {
                console.error("Invalid grid layout data");
            }
        }
    };
    
    const handleSaveClick = () => {
        // 현재 그리드 레이아웃 상태를 가져와서 onSave 함수에 전달
        //const currentGridLayout = Object.values(savedData).map(data => data.gridLayout);
        onSave(selectedId);
    };

    //console.log('savedDatasavedData', savedData)
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
        <Styled.Navbar dkey={isNavbarMinimized.toString()}>
            <div className="save-icon" onClick={handleSaveClick}>
                <FaSave /> {/* "저장" 아이콘 */}
            </div>
            <div className="icon" onClick={toggleNavbar}>
                {isNavbarMinimized ? <Icon src={FaChevronRight} alt="확대" /> : <Icon src={FaChevronLeft} alt="축소" />}
            </div>
            {savedData && Object.values(savedData).map((data, index) => {
                // Console log to check the data
                console.log("Data at index", index, ":", data);
                if(!data.selectedIconName)data.selectedIconName = "home";
                return (
                    <Styled.NavbarItem key={data.id} onClick={() => handleItemClickWithGridLayout(data)}>
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
                                <h3 style={{ margin: '0', verticalAlign: 'middle' }}>{data.id}</h3>
                            </Tooltip>
                        </div>
                    </Styled.NavbarItem>
                );
            })}

        </Styled.Navbar>
    );
};

export default Navbar;