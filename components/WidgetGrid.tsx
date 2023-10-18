import React, { useState, useEffect, useCallback } from 'react';
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

    // 메모이제이션된 이벤트 핸들러 생성
    const handleResizeStop = useCallback(
        (layout, oldItem, newItem) => {
            // 리사이즈가 끝났을 때 호출되는 코드
            setGridLayout(layout);
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

    const renderWidget = (itemKey: string) => {
        console.log('newGridItem', itemKey);
        switch (itemKey) {
            case 'a':
                return <Styled.WidgetCoral>위젯 A</Styled.WidgetCoral>;
            case 'b':
                return <Styled.WidgetGreen>위젯 B</Styled.WidgetGreen>;
            default:
                return <Styled.Widget>  <LineChart data={data} /></Styled.Widget>;
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
