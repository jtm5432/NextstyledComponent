import React, { useState,useRef, useEffect, useCallback } from 'react';
import ResizeHandle, { Responsive, WidthProvider } from 'react-grid-layout';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import { LayoutType, LayoutsProps } from '../types/WidgetGridTypes';
import Styled from '../styles/Widget.styles';
import { useQuery } from 'react-query';
import {fetchDashboardLineChart  } from '../app/queries/providerDashboard';
import LineChart from './organisms/LineChart';
const ResponsiveGridLayout = WidthProvider(Responsive);


const WidgetGrid: React.FC<LayoutsProps> = ({ layouts, setGridLayout }) => {
    const [currentLayouts, setCurrentLayouts] = useState(layouts);
    const { data, error, isLoading } = useQuery('dashboardLineChart', fetchDashboardLineChart);
    const widgetRef = useRef<HTMLDivElement>(null);  // div에 대한 ref
    const [dimensions, setDimensions] = useState<{ [key: string]: { width: number, height: number } }>({});
  
    const handleResizeStop = useCallback(
        (layout, oldItem, newItem) => {
            const element = document.getElementById(newItem.i);
            if (element) {
                const rect = element.getBoundingClientRect();
                console.log('rect before updatedDimensions', dimensions);

                setDimensions(prev => {
                    const updatedDimensions = {
                        ...prev,
                        [newItem.i]: {
                            width: rect.width,
                            height: rect.height
                        }
                    };
                    console.log('updatedDimensions', updatedDimensions);
                    return updatedDimensions;
                });
            }
            setGridLayout(layout); // 기존 코드 유지
        },
        [setGridLayout]
    );
    const handleDragStop = useCallback(
        (layout, oldItem, newItem) => {
            // 드래그가 끝났을 때 호출되는 코드
            setGridLayout(layout);
        },
        [setGridLayout]
    );

    useEffect(() => {
        setCurrentLayouts(layouts);
    }, [layouts]);
    useEffect(() => {
        // 초기 차트의 크기를 설정하는 로직
        const initialKey = "yourInitialKeyForTheChart";
        const element = document.getElementById(initialKey);
        if (element) {
            const rect = element.getBoundingClientRect();
            setDimensions(prev => ({
                ...prev,
                [initialKey]: {
                    width: rect.width,
                    height: rect.height
                }
            }));
        }
    }, []);
    
    const renderWidget = (itemKey: string) => {
        switch (itemKey) {
            case 'a':
                return <Styled.WidgetCoral>위젯 A</Styled.WidgetCoral>;
            case 'b':
                return <Styled.WidgetGreen>위젯 B</Styled.WidgetGreen>;
            default:
                const widgetDimensions = dimensions[itemKey] || { width: 0, height: 0 };
                console.log('widgetDimension123', widgetDimensions);
                return (
                    <Styled.Widget>
                        <div style={{ width: '100%', height: '100%' }}>
                        <LineChart
                                width={widgetDimensions.width}
                                height={widgetDimensions.height}
                                key={`${widgetDimensions.width}-${widgetDimensions.height}`}
                            />

                        </div>
                    </Styled.Widget>
                );
        }
    };
    return (
        <ResponsiveGridLayout
            className="layout"
            layouts={currentLayouts}
            breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
            cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
            isResizable={true}
            resizeHandles={["sw", "nw", "se", "ne"]}
            onResizeStop={handleResizeStop} // 메모이제이션된 핸들러 사용
            onDragStop={handleDragStop} // 메모이제이션된 핸들러 사용
        >
            {(currentLayouts.lg || []).map((item) => (
                <div key={item.i} id={item.i}>
                    {renderWidget(item.i)}
                </div>
            ))}
        </ResponsiveGridLayout>
    );
};

export default WidgetGrid;
