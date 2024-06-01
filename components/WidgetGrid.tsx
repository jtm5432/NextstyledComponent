import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Responsive, WidthProvider } from 'react-grid-layout';
import dynamic from 'next/dynamic';
import RecentDataTable from './templates/GlobeTable';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import { LayoutType, LayoutsProps } from '../types/WidgetGridTypes';
import Styled from '../styles/Widget.styles';
import debounce from 'lodash/debounce';
import { formatDate } from '../app/utils/TableFormatter';
import LineChart from './organisms/Highchart/DashboardHighchart';
import BarcolChart from './organisms/Highchart/BarcolHighchart';
import D3Chart from './organisms/D3Chart';
import HeaderModal from '../components/templates/HeaderModal';
import DataSelectModal from '../components/organisms/DataSelectModal';
import HoneycombChart from './organisms/Highchart/HoneycombChart';
import { useRecoilValue, useRecoilState } from 'recoil';
import { chartInfoMapState } from '../app/state/chartState';
import { CurrentLayoutState } from '../app/state/CurrentLayout';
import QueryDslDataTable from './templates/QueryDslTable';

interface ChartProperties {
    type: string;
    otherProp: object | string;  // Adjusted to accommodate both object and string types
}

// 서버사이드 렌더링을 방지하기 위해 동적 임포트 사용
const DynamicWorld = dynamic(
    () => import('./templates/Globe3D')
        .then(mod => mod.default)
        .catch((error) => {
            console.error("Error loading the Globe3D component:", error);
            throw error;
        }),
    {
        ssr: false,
        loading: () => <p>Loading...</p>
    }
);

const ResponsiveGridLayout = WidthProvider(Responsive);

const WidgetGrid: React.FC<LayoutsProps> = ({ layouts, setGridLayout }) => {
    const widgetRefs = useRef({});
    console.log('layouts', layouts, widgetRefs);
    const [currentLayouts, setCurrentLayouts] = useRecoilState(CurrentLayoutState);
    const [dimensions, setDimensions] = useState<{ [key: string]: { width: number, height: number } }>({});
    const lastArgsRef = useRef<any[]>([]);
    const [isResized, setIsResized] = useState(false);
    const debouncedHandleResizeStop = debounce(() => {
        setIsResized(prev => !prev);
    }, 200);
    const [chartInfoMap, setChartInfoMap] = useRecoilState(chartInfoMapState);
    const [selectedWidgetKey, setSelectedWidgetKey] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
   // const [chartInfoMap, setChartInfoMap] = useRecoilState(chartInfoMapState);

    const handleResizeStop = useCallback(
        (...args) => {
            lastArgsRef.current = args;
            debouncedHandleResizeStop();
        },
        [debouncedHandleResizeStop]
    );

    const handleDragStop = useCallback(
        (layout, oldItem, newItem) => {
            console.log('layoutdrag', layout, 'cr', currentLayouts);
    
            if (layout) {
                const updatedLayout = layout.map(layoutItem => {
                    const matchingCurrentLayout = currentLayouts.lg.find(currentLayoutItem => currentLayoutItem.i === layoutItem.i);
                    if (matchingCurrentLayout) {
                        layoutItem.ChartInfo = matchingCurrentLayout.ChartInfo;
                    }
                    return layoutItem;
                });
    
                setGridLayout(updatedLayout);
            }
        },
        [setGridLayout, currentLayouts]
    );

    useEffect(() => {
        console.log('layoutchange',layouts)
        setCurrentLayouts(layouts);
    }, [layouts]);

    useEffect(() => {
        const handleWindowResize = () => {
            debouncedHandleResizeStop();
        };

        window.addEventListener('resize', handleWindowResize);

        return () => {
            window.removeEventListener('resize', handleWindowResize);
        };
    }, []);
    useEffect(() => {
        if (currentLayouts && chartInfoMap.recentQuery &&chartInfoMap.recentQuery.type ) {
            const widgetIndex = currentLayouts.lg.findIndex(e => e.i === selectedWidgetKey);
            if (widgetIndex !== -1 && chartInfoMap.recentQuery.key === selectedWidgetKey) {
                // 기존 객체를 복사하고 ChartInfo 속성을 추가합니다.
                const updatedWidget = { ...currentLayouts.lg[widgetIndex], ChartInfo: chartInfoMap.recentQuery };
                console.log('widgetIndex',currentLayouts.lg[widgetIndex],chartInfoMap.recentQuery)
                // layouts.lg 배열에서 원래 객체를 교체합니다.
                const updatedLgArray = [
                    ...currentLayouts.lg.slice(0, widgetIndex),
                    updatedWidget,
                    ...currentLayouts.lg.slice(widgetIndex + 1)
                ];
    
                // layouts 객체를 복사하고 lg 배열을 업데이트합니다.
                const updatedLayouts = {
                    ...currentLayouts,
                    lg: updatedLgArray
                };
              //  layouts.lg=updatedLayouts;
                setCurrentLayouts(updatedLayouts);
                console.log('chartInfoMap has changed:', updatedWidget, chartInfoMap);
            }
        }
    }, [chartInfoMap, layouts, selectedWidgetKey, setCurrentLayouts]);
    

    const handleWidgetClick = (widgetData) => {
        console.log('handleWidgetClick',widgetData)
      
        setIsModalOpen(true);
        setSelectedWidgetKey(widgetData);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedWidgetKey(null);
    };

    const handleSave = () => {
      //  layouts.lg=currentLayouts;
        setGridLayout(currentLayouts.lg);
        setIsModalOpen(false);
    };

    const handleChange = (option) => {
        if (selectedWidgetKey) {
            // 상태 업데이트 로직
        }
    };

    useEffect(() => {
        const resizeObserver = new ResizeObserver(entries => {
            entries.forEach(entry => {
                const { width, height } = entry.contentRect;
                const widgetKey: any = entry.target.getAttribute('id');
                setDimensions(prevDimensions => ({
                    ...prevDimensions,
                    [widgetKey]: { width, height }
                }));
            });
        });

        Object.values(widgetRefs.current).forEach(ref => {
            if ((ref as React.RefObject<any>).current) {
                resizeObserver.observe((ref as React.RefObject<any>).current);
            }
        });

        return () => {
            Object.values(widgetRefs.current).forEach(ref => {
                if ((ref as React.RefObject<any>).current) {
                    resizeObserver.unobserve((ref as React.RefObject<any>).current);
                }
            });
        };
    }, []);

    const renderWidget = (itemKey: string, QuerryInfo:Array = {}) => {
        const widgetDimensions = dimensions[itemKey] || { width: 0, height: 0 };

        if (!widgetRefs.current[itemKey]) {
            widgetRefs.current[itemKey] = React.createRef();
        }
        const widgetRef = widgetRefs.current[itemKey];
        const chartInfo = chartInfoMap[itemKey] || { type: 'default' };
        console.log('widgetDimensions',QuerryInfo,QuerryInfo.type,itemKey)
       // if(QuerryInfo)chartInfo.type = 'Table'
        switch (QuerryInfo.type) {
            case 'a':
                return <Styled.WidgetCoral>위젯 A</Styled.WidgetCoral>;
            case 'b':
                return <Styled.WidgetGreen>위젯 B</Styled.WidgetGreen>;
            case 'line':
                return (
                    <Styled.Widget ref={widgetRef}>
                        <div style={{ width: '100%', height: '100%' }}>
                            <LineChart
                                width={widgetDimensions.width}
                                height={widgetDimensions.height}
                                key={itemKey}
                                widgetRef={widgetRef}
                                isResized={isResized}
                                linecharttype={'area'}
                            />
                        </div>
                    </Styled.Widget>
                );
            case 'd':
                return (
                    <Styled.Widget ref={widgetRef}>
                        <div style={{ width: '100%', height: '100%' }}>
                            <BarcolChart
                                width={widgetDimensions.width}
                                height={widgetDimensions.height}
                                key={itemKey}
                                widgetRef={widgetRef}
                                isResized={isResized}
                                sqlQuery={"SELECT ['firewall.dst.keyword'], avg(facility) AS aa FROM ['zen-{fw*'] WHERE query('(@timestamp:[now-2m TO now]) AND (firewall.action: drop)') GROUP BY ['firewall.dst.keyword'] LIMIT 10"}
                            />
                        </div>
                    </Styled.Widget>
                );
            case 'Globe3D':
                return (
                    <Styled.Widget ref={widgetRef}>
                        <DynamicWorld widgetRef={widgetRef} isResized={isResized} />
                    </Styled.Widget>
                );
            case 'table':
            //  const tablec = [
            //     { Header: 'timestamp', accessor: 'timestamp', Cell: ({ value }) => formatDate(value) },
            //     { Header: 'airline', accessor: 'airline' },
            //     { Header: 'srcAirportId', accessor: 'srcAirportId' },
            //     { Header: 'stops', accessor: 'stops' },
            // ];
            return (
                <div>
                {QuerryInfo && QuerryInfo.formattedQuery &&
                <Styled.Widget ref={widgetRef}>
                      <QueryDslDataTable
                        widgetRef={widgetRef}
                        isResized={isResized}
                        index="your-index" // 필요에 따라 인덱스 설정
                        query={QuerryInfo} // 쿼리 전달
                    />
                </Styled.Widget>
                }
                </div>
            );
            case 'GlobeTable':
                const columns = [
                    { Header: 'timestamp', accessor: 'timestamp', Cell: ({ value }) => formatDate(value) },
                    { Header: 'airline', accessor: 'airline' },
                    { Header: 'srcAirportId', accessor: 'srcAirportId' },
                    { Header: 'stops', accessor: 'stops' },
                ];
                return (
                    <Styled.Widget ref={widgetRef}>
                        <RecentDataTable widgetRef={widgetRef} isResized={isResized} columns={columns} />
                    </Styled.Widget>
                );
            case 'GlobeTableSecond':
                const columnsSecond = [
                    { Header: 'timestamp', accessor: 'timestamp', Cell: ({ value }) => formatDate(value) },
                    { Header: 'd.location', accessor: 'dstIata.location' },
                    { Header: 'o.location', accessor: 'ostIata.location' },
                    { Header: 'airline', accessor: 'airline' },
                ];
                return (
                    <Styled.Widget ref={widgetRef}>
                        <RecentDataTable widgetRef={widgetRef} isResized={isResized} columns={columnsSecond} />
                    </Styled.Widget>
                );
            case 'D3Chart':
                const chartType = 'pie';
                const initialChannel = 'realtime';
                return (
                    <Styled.Widget ref={widgetRef}>
                        <D3Chart chartType={chartType} initialChannel={initialChannel} widgetRef={widgetRef} isResized={isResized} />
                    </Styled.Widget>
                );
            default:
                return (
                    <Styled.Widget ref={widgetRef}>
                        <div onClick={() => handleWidgetClick(itemKey)}>
                            <div style={{ width: '100%', height: '100%' }}>
                                <HoneycombChart />
                            </div>
                        </div>
                    </Styled.Widget>
                );
        }
    };

    const selectedWidgetData = selectedWidgetKey ? chartInfoMap[selectedWidgetKey] : {};

    return (
        <>
            <ResponsiveGridLayout
                className="layout"
                layouts={currentLayouts}
                breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
                cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
                isResizable={true}
                resizeHandles={["sw", "nw", "se", "ne"]}
                onResizeStop={handleResizeStop}
                onDragStop={handleDragStop}
            >
                {(currentLayouts.lg || []).map((item) => (
                    <div key={item.i} id={item.i} onClick={() => handleWidgetClick(item.i)}>
                        {renderWidget(item.i,item.ChartInfo)}
                    </div>
                ))}
            </ResponsiveGridLayout>
            <HeaderModal isOpen={isModalOpen} onClose={handleCloseModal}>
                <DataSelectModal
                    data={selectedWidgetData}
                    onClose={handleCloseModal}
                    onSave={handleSave}
                    selectOptions={chartInfoMap}
                    onChange={handleChange}
                    selectedWidgetKey={selectedWidgetKey}
                    
                />
            </HeaderModal>
        </>
    );
};

export default WidgetGrid;
