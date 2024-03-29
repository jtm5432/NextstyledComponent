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
import { useQuery , useMutation ,UseMutationResult} from 'react-query';
import HeaderModal from '../components/templates/HeaderModal';
import ContentModal from '../components/organisms/ContentModal';
import {saveDataToLocalStorage ,SavegridLayouts,fetchSavedData  } from '../app/queries/providerDashboard';
import {SaveData ,GridLayout } from '../types/dashboardTypes';
interface QueryDataItem {
    id?: string;
    gridLayout?: any; // Replace 'any' with a more specific type if you know what it should be
    title: string;
    description: string;
    selectedIconName?: string;
}


// Assuming querydata is an object with string keys and QueryDataItem values
interface QueryData {
    [key: string]: QueryDataItem;
}
const Main: React.FC = () => {
    const CONTEXT_MENU_ID = 'main-context-menu';
    const { show } = useContextMenu({
        id: CONTEXT_MENU_ID,
    });
    const [data, setData] = useState({
        title: "Sample Title",
        description: "Sample Description"
    });

    const [gridLayout, setGridLayout] = useState<GridLayout[]>([
    
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
    const { data: querydata, isLoading, error } = useQuery('savedData', fetchSavedData);

    const [savedData, setSavedData] = useState<Record<string, QueryDataItem>>({});

    useEffect(() => {
        if (querydata) {
      //  console.log('querydataitem',querydata)
            const newSavedData = Object.keys(querydata).reduce((acc, key) => {
                const item = querydata[key];
             //   console.log('item',item)
                acc[key] = {
                    id: item.id || '',  
                    gridLayout: item.data.gridLayout || {},
                    title: item.title,
                    description: item.description,
                    selectedIconName: item.selectedIconName || ''
                };
                return acc;
            }, {} as Record<string, QueryDataItem>);
           // console.log('newSavedData',newSavedData); 
            setSavedData(newSavedData);
        }
    }, [querydata]);

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
      //  console.log('gridLayout',gridLayout);
        // 변경된 데이터 맵을 다시 로컬 스토리지에 저장
        localStorage.setItem('data', JSON.stringify(savedDataMap));
       // setSavedData(savedDataMap);

        setIsModalOpen(false);
    };
 
    //React Query: useMutation을 사용하여 데이터 저장
    const saveGridLayoutMutation = useMutation(
        ({ id, gridLayout }: { id: string; gridLayout: GridLayout[] }) => SavegridLayouts({ id, gridLayout }),
        {
          onSuccess: () => {
            alert("Grid layout이 성공적으로 저장되었습니다.");          },
          onError: (error) => {
            alert("Grid layout 저장 중 오류가 발생했습니다: " + error);
          }
        }
      );
    const saveMutation: UseMutationResult<SaveData, Error, SaveData> = useMutation(
        saveDataToLocalStorage, 
        {
          onSuccess: (data) => {
            console.log('saveDataToLocalStorage',data)
            // 성공 시 쿼리 무효화
            queryClient.invalidateQueries('localData');
          },
          onError: (error) => {
            // 에러 처리
            console.error('Error saving data', error);
          }
        }
      );

    // useEffect(() => {
    //     //const savedDataString = localStorage.getItem('data');
    //     console.log('savedDataString', savedDataString)
    //     // 2. useEffect에서 로컬 스토리지에서 데이터를 가져온 후, 상태를 업데이트합니다.
    //     if (savedDataString) {
    //         setSavedData(JSON.parse(savedDataString));
    //     }
        
     
    // }, []);
    // gridLayout을 서버에 저장하는 함수
    const handleSaveGridLayout = (id:string) => {
        // 현재 gridLayout 상태를 사용하여 mutation 실행
        console.log('handleSaveGridLayout',id,gridLayout)
       if(id)saveGridLayoutMutation.mutate({ id: id, gridLayout: gridLayout });
    };

    console.log('savedData',savedData)
    return (
        <QueryClientProvider client={queryClient}>
            <div>
                <Styled.MainContainer>
                    <Navbar savedData={savedData} setGridLayout={setGridLayout} onSave = {(id)=>handleSaveGridLayout(id)}/>

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
