import React, { useEffect, useState, useRef, forwardRef , useImperativeHandle } from 'react';
import Highcharts, { Chart } from 'highcharts'; // Chart를 추가로 임포트합니다.
import HighchartsReact from 'highcharts-react-official';
import debounce from 'lodash/debounce';


interface BaseChartProps {
    options: Highcharts.Options;
    handleChartCreated: Function;
}

const BaseChart = forwardRef<Chart | null, BaseChartProps>((props, ref) => {
    const { options,handleChartCreated } = props;
    const [fontSize, setFontSize] = useState('13px');
    const chartRef = useRef<Chart | null>(null);
//console.log('containerRef',chartRef)
    const updateFontSize = () => {
        if (chartRef.current) {
           
            const parentWidth = chartRef.current.container.parentElement?.clientWidth || 0;

            if (parentWidth <= 480) {
                setFontSize('10px'); // sm
            } else if (parentWidth <= 768) {
                setFontSize('13px'); // md
            } else {
                setFontSize('16px'); // lg
            }
        }
    };

    const debouncedUpdateFontSize = debounce(updateFontSize, 200); 
   // const resizeObserver = new ResizeObserver(updateFontSize as ResizeObserverCallback);


    useImperativeHandle(ref, () => chartRef.current as Chart, [chartRef]);

    const updatedOptions = {
        ...options,
        xAxis: {
            ...options.xAxis,  // 사용자가 제공하는 xAxis 옵션
            // 이후에 BaseChart에서 기본으로 제공하는 옵션
            labels: {
                ...(Array.isArray(options.xAxis) ? {} : options.xAxis?.labels),
                rotation: 0,  
                style: {
                    textOverflow: 'none'  
                },
            }
        },
        yAxis: {
            ...options.yAxis,  // 사용자가 제공하는 yAxis 옵션
            labels: {
                ...(Array.isArray(options.yAxis) ? {} : options.yAxis?.labels),
                style: {
                    textOverflow: 'none'
                },
            }
        },
        legend: {
            ...options.legend,  // 사용자가 제공하는 legend 옵션을 먼저 펼침
            // 이후에 BaseChart에서 기본으로 제공하는 옵션
            enabled: true,
            layout: 'vertical',
            align: 'right',
            verticalAlign: 'middle',
            itemStyle: {
                ...options.legend?.itemStyle,  // 사용자가 제공하는 itemStyle 옵션
                // 기본 itemStyle 옵션
                fontWeight: 'bold',
                fontSize: fontSize,
            },
            itemHoverStyle: {
                ...options.legend?.itemHoverStyle,  // 사용자가 제공하는 itemHoverStyle 옵션
                // 기본 itemHoverStyle 옵션
                color: '#FF0000',
            },
            // ... 기타 레전드 관련 옵션들
        },
    };
 

    return <HighchartsReact highcharts={Highcharts} options={updatedOptions} callback={handleChartCreated} />;

});

export default React.memo(BaseChart);
