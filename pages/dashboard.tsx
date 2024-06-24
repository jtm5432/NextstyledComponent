// Main.tsx
import React, { useState, useEffect } from 'react';
import 'tailwindcss/tailwind.css';
import Styled from '../styles/dashboard.styles';
import WidgetGrid from '../components/WidgetGrid';
import 'react-contexify/dist/ReactContexify.css';
import { Menu, Item, useContextMenu } from 'react-contexify';
import { QueryClient, QueryClientProvider } from 'react-query';
import { handleItemClick, handleContextMenu } from '../app/hooks/ContextHandler';
import Navbar from '../components/templates/Navbar';
import { useQuery, useMutation, UseMutationResult } from 'react-query';
import HeaderModal from '../components/templates/HeaderModal';
import ContentModal from '../components/organisms/ContentModal';
import { saveDataToLocalStorage, SavegridLayouts, fetchSavedData } from '../app/queries/providerDashboard';
import { SaveData, GridLayout } from '../types/dashboardTypes';
import InfoBar from '../components/templates/InfoBar';

interface QueryDataItem {
    id?: string;
    gridLayout?: any;
    title: string;
    description: string;
    selectedIconName?: string;
}

interface QueryData {
    [key: string]: QueryDataItem;
}

const Main: React.FC = () => {
    const CONTEXT_MENU_ID = 'main-context-menu';
    const { show } = useContextMenu({ id: CONTEXT_MENU_ID });
    const [data, setData] = useState({ title: "Sample Title", description: "Sample Description" });
    const [gridLayout, setGridLayout] = useState<GridLayout[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isWidgetClicked, setIsWidgetClicked] = useState(false);
    const [isInfoBarOpen, setIsInfoBarOpen] = useState(false);
    const [infoBarContent, setInfoBarContent] = useState<React.ReactNode>(null);
    const queryClient = new QueryClient();
    const { data: querydata, isLoading, error, refetch } = useQuery('savedData', fetchSavedData);
    const [savedData, setSavedData] = useState<Record<string, QueryDataItem>>({});

    useEffect(() => {
        if (querydata) {
            const newSavedData = Object.keys(querydata).reduce((acc, key) => {
                const item = querydata[key];
                acc[key] = {
                    id: item.id || '',  
                    gridLayout: item.data.gridLayout || {},
                    title: item.title,
                    description: item.description,
                    selectedIconName: item.selectedIconName || ''
                };
                return acc;
            }, {} as Record<string, QueryDataItem>);
            setSavedData(newSavedData);
        }
    }, [querydata]);

    const handleOpenModal = () => {
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    const handleSave = (updatedData: { [key: string]: string; }) => {
        let { title, description, selectedIconName } = updatedData;
        if (!title) {
            alert('제목과 입력해주세요.');
            return;
        }
        if (!description) {
            description = '';
        }

        setIsModalOpen(false);
        handleSaveGridLayout(title, gridLayout, updatedData);
    };

    const saveGridLayoutMutation = useMutation(
        ({ id, gridLayout, updatedData }: { id: string; gridLayout: GridLayout[]; updatedData: { [key: string]: string; } }) => SavegridLayouts({ id, gridLayout, updatedData }),
        {
            onSuccess: () => {
                alert("Grid layout이 성공적으로 저장되었습니다.");
                refetch(); // 데이터 갱신
            },
            onError: (error) => {
                alert("Grid layout 저장 중 오류가 발생했습니다: " + error);
            }
        }
    );

    const saveMutation: UseMutationResult<SaveData, Error, SaveData> = useMutation(
        saveDataToLocalStorage, 
        {
          onSuccess: (data) => {
            console.log('saveDataToLocalStorage', data);
            queryClient.invalidateQueries('localData');
          },
          onError: (error) => {
            console.error('Error saving data', error);
          }
        }
    );

    const handleSaveGridLayout = (id: string, gridLayout: GridLayout[], updatedData: { [key: string]: string; }) => {
        console.log('handleSave',id,savedData,gridLayout)
        if (id) saveGridLayoutMutation.mutate({ id: id, gridLayout: gridLayout, updatedData: updatedData });
    };

    const openInfoBar = (content: React.ReactNode) => {
        setInfoBarContent(content);
        setIsInfoBarOpen(true);
    };

    return (
        <QueryClientProvider client={queryClient}>
            <div>
                <Styled.MainContainer>
                    <Navbar savedData={savedData} setGridLayout={setGridLayout} onSave={(id) => handleSaveGridLayout(id, gridLayout)} />
                    <Styled.WidgetContainer onContextMenu={(event) => handleContextMenu(show, event, setIsWidgetClicked)}>
                        <Styled.TitleArea>
                            <h2>Main Dashboard</h2>
                        </Styled.TitleArea>
                        <WidgetGrid layouts={{ lg: gridLayout }} setGridLayout={setGridLayout} openInfoBar={openInfoBar} />

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
                <InfoBar content={infoBarContent} isOpen={isInfoBarOpen} onClose={() => setIsInfoBarOpen(false)} />
            </div>
        </QueryClientProvider>
    );
};

export default Main;
