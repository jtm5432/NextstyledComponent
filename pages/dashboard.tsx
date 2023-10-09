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
import { handleItemClick, handleContextMenu } from '../app/ContextHandler';
import Modal from '../components/modal';
import ContentModal from '../components/ContentModal';



const Main: React.FC = () => {
    const CONTEXT_MENU_ID = 'main-context-menu';
    const { show } = useContextMenu({
        id: CONTEXT_MENU_ID,
    });
    const [data, setData] = useState({
        title: "Sample Title",
        description: "Sample Description"
    });
    const queryClient = new QueryClient();
    const [gridLayout, setGridLayout] = useState([
        { i: 'a', x: 0, y: 0, w: 1, h: 2 },
        { i: 'b', x: 1, y: 0, w: 3, h: 2 },
        { i: 'c', x: 4, y: 0, w: 1, h: 2 },
    ]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const handleOpenModal = () => {
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };
    const [savedData, setSavedData] = useState<Record<string, titleData>>({});
    const handleSave = (updatedData: { [key: string]: string; }) => {
        const title = updatedData.title;
        const description = updatedData.description;

        if (!title || !description) {
            console.error("Invalid data format");
            return;
        }

        // 로컬 스토리지에서 기존의 데이터 불러오기
        const savedDataString = localStorage.getItem('data');
        let savedDataMap: Record<string, { title: string, description: string }> = {};

        // 기존 데이터가 있으면 파싱
        if (savedDataString) {
            savedDataMap = JSON.parse(savedDataString);
        }

        // 새로운 데이터 추가 (title을 키로 사용하여 중복되는 데이터를 덮어쓰기)
        savedDataMap[title] = { title, description };

        // 변경된 데이터 맵을 다시 로컬 스토리지에 저장
        localStorage.setItem('data', JSON.stringify(savedDataMap));
        setSavedData(savedDataMap);

        setIsModalOpen(false);
    };


    const handleDelete = (titleToDelete: string) => {
        // 로컬 스토리지에서 데이터 불러오기
        const savedDataString = localStorage.getItem('data');
        let savedDataMap: Record<string, titleData> = {};

        // 데이터가 있으면 파싱
        if (savedDataString) {
            savedDataMap = JSON.parse(savedDataString);
        }

        // titleToDelete 값을 키로 가진 데이터 삭제
        if (savedDataMap[titleToDelete]) {
            delete savedDataMap[titleToDelete];
        }

        // 변경된 데이터 맵을 다시 로컬 스토리지에 저장
        localStorage.setItem('data', JSON.stringify(savedDataMap));
    };

    useEffect(() => {
        const storageKey = `data_${data.title}`;
        const savedDataString = localStorage.getItem('data');

        // 2. useEffect에서 로컬 스토리지에서 데이터를 가져온 후, 상태를 업데이트합니다.
        if (savedDataString) {
            setSavedData(JSON.parse(savedDataString));
        }

    }, []);
    return (
        <QueryClientProvider client={queryClient}>
            <div>
                <Styled.MainContainer onContextMenu={(event) => handleContextMenu(show, event)}>
                    <Styled.Navbar>
                        {Object.values(savedData).map((data, index) => (
                            <div key={index}>
                                <h3>{data.title}</h3>
                                <p>{data.description}</p>
                            </div>
                        ))}
                    </Styled.Navbar>
                    <Styled.WidgetContainer>
                        <WidgetGrid layouts={{ lg: gridLayout }} setGridLayout={setGridLayout} />

                        {/* <WidgetGrid layouts={{ lg: gridLayout }} /> */}

                    </Styled.WidgetContainer>
                    <Menu id={CONTEXT_MENU_ID}>
                        <Item onClick={() => handleItemClick(show, setGridLayout, { id: 'add' })}>Add Widget</Item>
                        <Item onClick={(props) => handleItemClick(show, setGridLayout, { id: 'delete', props })}>Delete Widget</Item>
                        <Item onClick={handleOpenModal}>Open Modal</Item>

                    </Menu>


                </Styled.MainContainer>
                <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
                    <ContentModal
                        data={data}
                        onClose={handleCloseModal}
                        onSave={handleSave}
                    />
                </Modal>
            </div>
        </QueryClientProvider>
    );
};

export default Main;
