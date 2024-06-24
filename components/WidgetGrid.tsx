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
import LineChart from './molecules/D3ChartTypes/LineChart';
import BarcolChart from './organisms/Highchart/BarcolHighchart';
import D3Chart from './organisms/D3Chart';
import HeaderModal from '../components/templates/HeaderModal';
import DataSelectModal from '../components/organisms/DataSelectModal';
import HoneycombChart from './organisms/Highchart/HoneycombChart';
import { useRecoilState } from 'recoil';
import { chartInfoMapState } from '../app/state/chartState';
import { CurrentLayoutState } from '../app/state/CurrentLayout';
import QueryDslDataTable from './templates/QueryDslTable';
import { infoBarState } from '../app/state/InfoModal';
import HeaderRow from './templates/HeaderRow';

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

interface WidgetGridProps extends LayoutsProps {
    openInfoBar: (content: React.ReactNode) => void;
}

const WidgetGrid: React.FC<WidgetGridProps> = ({ layouts, setGridLayout, openInfoBar }) => {
    const widgetRefs = useRef({});
    const [currentLayouts, setCurrentLayouts] = useRecoilState(CurrentLayoutState);
    const [dimensions, setDimensions] = useState<{ [key: string]: { width: number, height: number } }>({});
    const lastArgsRef = useRef<any[]>([]);
    const [isResized, setIsResized] = useState(false);
    const debouncedHandleResizeStop = debounce(() => {
        setIsResized(prev => !prev);
    }, 200);
    const [chartInfoMap, setChartInfoMap] = useRecoilState(chartInfoMapState);
    const [selectedWidgetKey, setSelectedWidgetKey] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [infoBar, setInfoBar] = useRecoilState(infoBarState);

    const handleDragStop = useCallback(
        (layout, oldItem, newItem) => {
            const updatedLayout = layout.map(item => {
                const matchingCurrentLayout = currentLayouts.lg.find(l => l.i === item.i);
                return matchingCurrentLayout ? { ...item, ChartInfo: matchingCurrentLayout.ChartInfo } : item;
            });
    
            setGridLayout([...updatedLayout]);
        },
        [setGridLayout, currentLayouts]
    );
    
    const handleResizeStop = useCallback(
        (layout, oldItem, newItem) => {
            const updatedLayout = layout.map(item => {
                const matchingCurrentLayout = currentLayouts.lg.find(l => l.i === item.i);
                return matchingCurrentLayout ? { ...item, ChartInfo: matchingCurrentLayout.ChartInfo } : item;
            });
    
            setGridLayout([...updatedLayout]);
            debouncedHandleResizeStop();
        },
        [debouncedHandleResizeStop, setGridLayout, currentLayouts]
    );
    

    useEffect(() => {
        setCurrentLayouts(layouts);
    }, [layouts, setCurrentLayouts]);

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
        if (currentLayouts && chartInfoMap.recentQuery && chartInfoMap.recentQuery.type) {
            const widgetIndex = currentLayouts.lg.findIndex(e => e.i === selectedWidgetKey);
            if (widgetIndex !== -1 && chartInfoMap.recentQuery.key === selectedWidgetKey) {
                const updatedWidget = { ...currentLayouts.lg[widgetIndex], ChartInfo: chartInfoMap.recentQuery };
                const updatedLgArray = [
                    ...currentLayouts.lg.slice(0, widgetIndex),
                    updatedWidget,
                    ...currentLayouts.lg.slice(widgetIndex + 1)
                ];

                const updatedLayouts = {
                    ...currentLayouts,
                    lg: updatedLgArray
                };
                setCurrentLayouts(updatedLayouts);
            }
        }
    }, [chartInfoMap, layouts, selectedWidgetKey, setCurrentLayouts]);

    const handleWidgetClick = (widgetData) => {
        setSelectedWidgetKey(widgetData);
        setIsModalOpen(true);

    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedWidgetKey(null);
    };

    const handleSave = () => {
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

    const renderWidget = (itemKey: string, QuerryInfo: Array = {}) => {
        const widgetDimensions = dimensions[itemKey] || { width: 0, height: 0 };
    
        if (!widgetRefs.current[itemKey]) {
            widgetRefs.current[itemKey] = React.createRef();
        }
        const widgetRef = widgetRefs.current[itemKey];
        const chartInfo = chartInfoMap[itemKey] || { type: 'default' };
    
        const handleInfoBarClick = () => {
            const content = (
                <div>
                    <h3>{QuerryInfo.title}</h3>
                    <p>{QuerryInfo.description}</p>
                </div>
            );
            setInfoBar({ isOpen: true, content });
        };
    
        const title = QuerryInfo.title || "Widget Title";
        const showTitle = QuerryInfo.showTitle !== false;  // 기본값을 true로 설정
    
        return (
            <Styled.Widget
                ref={widgetRef}
                style={{ zIndex: selectedWidgetKey === itemKey ? 1000 : 1 }}
                onClick={() => handleWidgetClick(itemKey)}
            >
                <HeaderRow title={title} onInfoClick={handleInfoBarClick} showTitle={showTitle} />
                <div style={{ width: '100%', height: showTitle ? 'calc(100% - 40px)' : '100%' }}>
                    {(() => {
                        switch (QuerryInfo.type) {
                            case 'a':
                                return <Styled.WidgetCoral>위젯 A</Styled.WidgetCoral>;
                            case 'b':
                                return <Styled.WidgetGreen>위젯 B</Styled.WidgetGreen>;
                            case 'line':
                                return (
                                    <div>
                                        {QuerryInfo && QuerryInfo.formattedQuery &&
                                            <LineChart
                                                query={QuerryInfo}
                                                width={widgetDimensions.width}
                                                height={widgetDimensions.height}
                                                widgetRef={widgetRef}
                                                isResized={isResized}
                                                colorScale="blue"
                                                margin={{ top: 20, right: 20, bottom: 30, left: 40 }}
                                            />
                                        }
                                    </div>
                                );
                            case 'd':
                                return (
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
                                );
                            case 'Globe3D':
                                return (
                                    <DynamicWorld widgetRef={widgetRef} isResized={isResized} />
                                );
                            case 'table':
                                return (
                                    <div>
                                        {QuerryInfo && QuerryInfo.formattedQuery &&
                                            <QueryDslDataTable
                                                widgetRef={widgetRef}
                                                isResized={isResized}
                                                index="your-index"
                                                query={QuerryInfo}
                                            />
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
                                    <RecentDataTable widgetRef={widgetRef} isResized={isResized} columns={columns} />
                                );
                            case 'GlobeTableSecond':
                                const columnsSecond = [
                                    { Header: 'timestamp', accessor: 'timestamp', Cell: ({ value }) => formatDate(value) },
                                    { Header: 'd.location', accessor: 'dstIata.location' },
                                    { Header: 'o.location', accessor: 'ostIata.location' },
                                    { Header: 'airline', accessor: 'airline' },
                                ];
                                return (
                                    <RecentDataTable widgetRef={widgetRef} isResized={isResized} columns={columnsSecond} />
                                );
                            case 'D3Chart':
                                const chartType = 'pie';
                                const initialChannel = 'realtime';
                                return (
                                    <D3Chart chartType={chartType} initialChannel={initialChannel} widgetRef={widgetRef} isResized={isResized} />
                                );
                            default:
                                return (
                                    <HoneycombChart
                                        query={QuerryInfo}
                                        width={widgetDimensions.width}
                                        height={widgetDimensions.height}
                                        widgetRef={widgetRef}
                                        isResized={isResized}
                                        colorScale="blue"
                                    />
                                );
                        }
                    })()}
                    <button onClick={handleInfoBarClick}>Info</button>
                </div>
            </Styled.Widget>
        );
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
                allowOverlap={true}  // 위젯 겹치기 허용
            >
                {(currentLayouts.lg || []).map((item) => (
                    <div key={item.i} id={item.i} onClick={() => handleWidgetClick(item.i)}>
                        {renderWidget(item.i, item.ChartInfo)}
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
