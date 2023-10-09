// components/WidgetGrid.tsx
import React from 'react';
import ResizeHandle, { Responsive, WidthProvider } from 'react-grid-layout';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import { LayoutType, LayoutsProps } from '../types/WidgetGridTypes';
import { useState, useEffect } from 'react';
import Styled from '../styles/Widget.styles';
const ResponsiveGridLayout = WidthProvider(Responsive);



const WidgetGrid: React.FC<LayoutsProps> = ({ layouts, setGridLayout }) => {
    const [currentLayouts, setCurrentLayouts] = useState(layouts);
    const renderWidget = (itemKey: string) => {
        console.log('newGridItem',itemKey);
        switch (itemKey) {
            case 'a':
                return <Styled.WidgetCoral>위젯 A</Styled.WidgetCoral>;
            case 'b':
                return <Styled.WidgetGreen>위젯 B</Styled.WidgetGreen>;
            default:
                return <Styled.Widget>위젯 C</Styled.Widget>;
        }
    };

    const addWidget = () => {
        const newGridItem = { i: Date.now().toString(), x: 0, y: Infinity, w: 1, h: 2 };
        setGridLayout(prevLayouts => ({
            ...prevLayouts,
            lg: [...prevLayouts!, newGridItem]
        }));
    }

    useEffect(() => {
        setCurrentLayouts(layouts);
    }, [layouts]);
    
    return (
        <ResponsiveGridLayout
            className="layout"
            layouts={currentLayouts}
            breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
            cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
            isResizable={true}
            resizeHandles={["sw", "nw", "se", "ne"]}
            preventCollision={true}

        >
            {(currentLayouts.lg || []).map(item => (
                <div key={item.i}>
                    {renderWidget(item.i)}
                </div>
            ))}
        </ResponsiveGridLayout>
    );
};

export default WidgetGrid;
