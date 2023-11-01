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
    const [LegendWidth, setLegendWidth] = useState(0);
    //const legendWidth = chartWidth * 0.2; // 차트 너비의 20%
    const chartRef = useRef<Chart | null>(null);
//console.log('containerRef',chartRef)

    useEffect(() => {
        const ChartWidth = Number(options?.chart?.width);
        console.log('parentWidth2',options?.chart?.width)
        setLegendWidth( ChartWidth *0.2 || 0);
        if (ChartWidth <= 300) {
            setFontSize('10px'); // sm
        } else if (ChartWidth <= 550) {
            setFontSize('12px'); // md
        } else {
            setFontSize('14px'); // lg
        }
    }, [options?.chart?.width]);

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
            min: 0, // y축이 0부터 시작하도록 설정
            labels: {
                ...(Array.isArray(options.yAxis) ? {} : options.yAxis?.labels),
                formatter: (function() {
                    var lastVal;  // 마지막으로 표시된 정수 값을 추적
                    return function() {
                        var rounded = Math.round(this.value);
                        if (rounded !== lastVal) {
                            lastVal = rounded;
                            return rounded;
                        }
                        return '';  // 이미 표시된 값이면 빈 문자열 반환
                    };
                })(),
                style: {
                    textOverflow: 'none'
                },
            }
        },        
        legend: {
            ...options.legend,  // 사용자가 제공하는 legend 옵션을 먼저 펼침
            // 이후에 BaseChart에서 기본으로 제공하는 옵션
            enabled: true,
            width : LegendWidth,
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
        title:{
            text:""
        },
    };
 

    return <HighchartsReact highcharts={Highcharts} options={updatedOptions} callback={handleChartCreated} />;

});

export default React.memo(BaseChart);
