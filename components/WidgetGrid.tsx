import React, { useState, useRef, useEffect, useCallback } from 'react';
import ResizeHandle, { Responsive, WidthProvider } from 'react-grid-layout';
import dynamic from 'next/dynamic';
import RecentDataTable from './templates/GlobeTable';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import { LayoutType, LayoutsProps } from '../types/WidgetGridTypes';
import Styled from '../styles/Widget.styles';
import { useQuery } from 'react-query';
import { fetchDashboardLineChart } from '../app/queries/providerDashboard';
import debounce from 'lodash/debounce';
import {formatDate} from '../app/utils/TableFormatter';
import LineChart  from './organisms/Highchart/DashboardHighchart';
import BarcolChart  from './organisms/Highchart/BarcolHighchart';
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
  
//import Globe3D from './organisms/Globe3D';

const ResponsiveGridLayout = WidthProvider(Responsive);


const WidgetGrid: React.FC<LayoutsProps> = ({ layouts, setGridLayout }) => {
    console.log('layouts', layouts)
    const [currentLayouts, setCurrentLayouts] = useState(layouts);
  //const widgetRef = useRef<HTMLDivElement>(null);  // div에 대한 ref
    const [dimensions, setDimensions] = useState<{ [key: string]: { width: number, height: number } }>({});
    const lastArgsRef = useRef<any[]>([]);

    const [isResized, setIsResized] = useState(false);

    const debouncedHandleResizeStop = debounce(() => {
        setIsResized(prev => !prev);
     
    }, 200);
    const [chartInfoMap, setChartInfoMap] = useState({
        'a': { type: 'line', otherProp: 'value1' },
        'b': { type: 'bar', otherProp: 'value2' },
        'c': { type: 'c', otherProp: 'value3' },
        'd': { type: 'd', otherProp: 'value3' },
          'Globe3D':{type:'Globe3D',otherProp:'value4'},
        'GlobeTable':{type:'GlobeTable',otherProp:'value5'},
        'GlobeTableSecond':{type:'GlobeTableSecond',otherProp:'value6'},
    });

    const handleResizeStop = useCallback(
        (...args) => {
            lastArgsRef.current = args;
            debouncedHandleResizeStop();
        },
        [debouncedHandleResizeStop]
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
        const handleWindowResize = () => {
            debouncedHandleResizeStop();
            // 여기에 윈도우 크기가 변경될 때 원하는 로직을 추가
        };
    
        window.addEventListener('resize', handleWindowResize);
    
        return () => {
            window.removeEventListener('resize', handleWindowResize);
        };
    }, []);
    
    const renderWidget = (itemKey: string) => {
        const widgetDimensions = dimensions[itemKey] || { width: 0, height: 0 };
        const widgetRef = useRef<HTMLDivElement>(null); // 고유한 widgetRef 생성
        const chartInfo = chartInfoMap[itemKey] || { type: 'default' };
        console.log('chartInfo',chartInfo)
        switch (chartInfo.type) {
            case 'a':
                return <Styled.WidgetCoral>위젯 A</Styled.WidgetCoral>;
            case 'b':
                return <Styled.WidgetGreen>위젯 B</Styled.WidgetGreen>;
            case 'c':{
                // const widgetDimensions = dimensions[itemKey] || { width: 0, height: 0 };
                // const widgetRef = useRef<HTMLDivElement>(null); // 고유한 widgetRef 생성

                console.log('widgetDimension123', widgetDimensions);
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
            }
            case 'Globe3D':{
                return (
                    <Styled.Widget ref={widgetRef}>
                          <DynamicWorld widgetRef={widgetRef} isResized={isResized} />
                    </Styled.Widget>
                );
            
            }
            case 'GlobeTable':{
                const columns = [
                    { Header: 'timestamp', accessor: 'timestamp', Cell: ({ value }) => formatDate(value)  },
                    { Header: 'airline', accessor: 'airline' },
                    { Header: 'srcAirportId', accessor: 'srcAirportId' },
                    { Header: 'stops', accessor: 'stops' },
                ]
                return (
                    <Styled.Widget ref={widgetRef}>
                            <RecentDataTable widgetRef={widgetRef} isResized={isResized} columns = {columns}/>
                    </Styled.Widget>

                )
            }
            case 'GlobeTableSecond':{
                const columns =   [
                    { Header: 'timestamp', accessor: 'timestamp'  ,Cell: ({ value }) => formatDate(value)  },
                    { Header: 'd.location', accessor: 'dstIata.location' },
                    { Header: 'o.location', accessor: 'ostIata.location' },
                    { Header: 'airline', accessor: 'airline' },
                 ];
        
                return (
                    <Styled.Widget ref={widgetRef}>
                            <RecentDataTable widgetRef={widgetRef} isResized={isResized} columns = {columns} />
                    </Styled.Widget>

                )
            }
            default:{
               
                console.log('widgetDimension123', widgetDimensions);
                return (
                    <Styled.Widget ref={widgetRef}>
                        <div style={{ width: '100%', height: '100%' }}>
                            <BarcolChart
                                width={widgetDimensions.width}
                                height={widgetDimensions.height}
                                key={itemKey}
                                widgetRef={widgetRef}
                                isResized={isResized}
                             
                            />

                        </div>
                    </Styled.Widget>
                );
                }
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
                <div key={item.i} id={item.i} >
                    {renderWidget(item.i)}
                </div>
            ))}
        </ResponsiveGridLayout>
    );
};

export default WidgetGrid;
