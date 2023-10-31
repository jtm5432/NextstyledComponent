/**
 * 대시보드 페이지입니다.
 * 좌측에 위젯을 불러오는 네비게이션 바가 있고, 우측에 위젯을 배치할 수 있는 공간이 있습니다.
 */
import React, { useState, useEffect } from 'react';
import 'tailwindcss/tailwind.css';
import Styled from '../styles/dashboard.styles';
import WidgetGrid from '../components/WidgetGrid';
import 'react-contexify/dist/ReactContexify.css';
import { Menu, Item, useContextMenu, } from 'react-contexify';
import { QueryClient, QueryClientProvider } from 'react-query';
import { titleData } from '../types/localStorage'
import { handleItemClick, handleContextMenu } from '../app/hooks/ContextHandler';
import Navbar from '../components/templates/Navbar'; // Navbar 컴포넌트 파일을 import
import { useQuery } from 'react-query';
import HeaderModal from '../components/templates/HeaderModal';
import ContentModal from '../components/organisms/ContentModal';



const Main: React.FC = () => {
    const CONTEXT_MENU_ID = 'main-context-menu';
    const { show } = useContextMenu({
        id: CONTEXT_MENU_ID,
    });
    const [data, setData] = useState({
        title: "Sample Title",
        description: "Sample Description"
    });
    const [gridLayout, setGridLayout] = useState([
       
        // { i: 'c', x: 4, y: 0, w: 2, h: 2 },
        // { i: 'd', x: 4, y: 2, w: 2, h: 2 },
        { i: 'Globe3D',x: 4, y: 2, w: 4, h: 4 },
        { i:'GlobeTable',x:0, y:2, w:2, h:2},
        {i:'GlobeTableSecond',x:8,y:2,w:3,h:2},
    ]);
    // const [LayoutConfig, setLayoutConfig] = useState({
    //     "a": {"chart":"LineChart","config":""},
    //     "b": {"chart":"LineChart","config":""},
    //     "c": {"chart":"LineChart","config":""},
        
    // })
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isWidgetClicked, setIsWidgetClicked] = useState(false);
    const queryClient = new QueryClient();

    const handleOpenModal = () => {
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };
    const [savedData, setSavedData] = useState<Record<string, titleData>>({});
    const handleSave = (updatedData: { [key: string]: string; }) => {
        // console.log('updatedData',updatedData)
        let { title, description, selectedIconName } = updatedData;
        if (!title) {
            alert('제목과 입력해주세요.');
            return;
        }
        if (!description) {
            description = '';
        }

        // 로컬 스토리지에서 기존의 데이터 불러오기
        const savedDataString = localStorage.getItem('data');
        let savedDataMap: Record<string, { title: string, description: string, selectedIconName: string, gridLayout: string }> = {};

        // 기존 데이터가 있으면 파싱
        if (savedDataString) {
            savedDataMap = JSON.parse(savedDataString);
        }

        // 새로운 데이터 추가 (title을 키로 사용하여 중복되는 데이터를 덮어쓰기)
        savedDataMap[title] = { title, description, selectedIconName, gridLayout: JSON.stringify(gridLayout) };
        //console.log('gridLayout',gridLayout);
        // 변경된 데이터 맵을 다시 로컬 스토리지에 저장
        localStorage.setItem('data', JSON.stringify(savedDataMap));
        setSavedData(savedDataMap);

        setIsModalOpen(false);
    };
 

    useEffect(() => {
        const savedDataString = localStorage.getItem('data');
        console.log('savedDataString', savedDataString)
        // 2. useEffect에서 로컬 스토리지에서 데이터를 가져온 후, 상태를 업데이트합니다.
        if (savedDataString) {
            setSavedData(JSON.parse(savedDataString));
        }
        
     
    }, []);
    return (
        <QueryClientProvider client={queryClient}>
            <div>
                <Styled.MainContainer>
                    <Navbar savedData={savedData} setGridLayout={setGridLayout} />

                    <Styled.WidgetContainer onContextMenu={(event) => handleContextMenu(show, event, setIsWidgetClicked)}>
                        <Styled.TitleArea>
                            <h2>Main Dashboard</h2>
                        </Styled.TitleArea>
                        <WidgetGrid layouts={{ lg: gridLayout }} setGridLayout={setGridLayout} />

                        <Menu id={CONTEXT_MENU_ID}>
                            <Item onClick={() => handleItemClick(show, setGridLayout, { id: 'add' })}>Add Widget</Item>
                            {isWidgetClicked && (
                                <Item onClick={(props) => handleItemClick(show, setGridLayout, { id: 'delete', props })}>Delete Widget</Item>
                            )}
                            <Item onClick={handleOpenModal}>Open Modal</Item>

                        </Menu>

                    </Styled.WidgetContainer>


                </Styled.MainContainer>
                <HeaderModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
                    <ContentModal
                        data={data}
                        onClose={handleCloseModal}
                        onSave={handleSave}
                    />
                </HeaderModal>
            </div>
        </QueryClientProvider>
    );
};

export default Main;
