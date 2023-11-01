import React, { useEffect, useRef, useState } from 'react';
import BaseChart from '../HighChartBase';
import { useQuery } from 'react-query';
import { fetchDashboardBarcolChart } from '../../../../app/queries/providerDashboard';
import { Options, Chart } from 'highcharts'
import { ChartContainer } from '../ChartContiner.styles';
import { parsedRowData } from '../../../../app/utils/parsedRowData';

interface BarColChartProps {
    width?: number;
    height?: number;
    widgetRef?: React.RefObject<HTMLDivElement>;
    isResized?: React.ComponentState;
}

const BarColChart: React.FC<BarColChartProps> = ({ width = 100, height = 100, widgetRef, isResized }) => {
    const [chartData, setChartData] = useState<Options | null>(null);
    const chartRef = useRef<Chart | null>(null);
    console.log('BarColChart', chartData, chartRef)

    // const ParentwidgetRef = useRef<HTMLDivElement>(widgetRef);
    const [chartWidth, setChartWidth] = useState<number>(width);
    const [chartHeight, setChartHeight] = useState<number>(height);
    const { data, isLoading, refetch } = useQuery<string>('dashboardbarColChart', fetchDashboardBarcolChart, {  // data의 타입을 string으로 변경
        onSuccess: (rawData: string) => {
            console.log('rawData',rawData)
            const chartObj = rawData; // rawData를 JSON 객체로 파싱

            const formatData = (data: any[], format: string) => {
                return data.map(item => {
                    if (format === 'percent') {
                        return Number((item * 100).toFixed(2));
                    } else if (format === 'time') {
                        return item !== 0 ? Number((item / 1000000).toFixed(2)) : 0;
                    } else if (format === "data") {
                        return (Number(item));
                    }
                    return item;
                });
            };

            const seriesData = chartObj.multi ?
                Object.keys(chartObj.data).map(key => ({
                    name: key,
                    data: chartObj.data[key],
                })) :
                [{
                    data: chartObj.data
                }];

            // 툴팁 포매터 설정
            const tooltipFormatter = function () {
                let key = this.series.name;
                if (key.length > 20) {
                    key = key.substring(0, 9) + "..." + key.substring(key.length - 9, key.length);
                }
                const x = this.x;
                let value = this.y;

            
                return `<span class="ex_col_com" style="color:${this.point.color}">\u25A0</span> ${x}[${key}] : <b>${value}</b>`;
            };

            const transformedData: Options = {
                chart: {
                    type: 'bar', // 차트 타입 설정
                    width: chartWidth,  // 여기에 width를 설정
                    height: chartHeight  // 여기에 height를 설정
                },
                title: {
                    // 제목 설정 (필요한 경우)
                },
                xAxis: {
                    categories: chartObj.categories
                },
                yAxis: {
                    // Y축 설정 (필요한 경우)
                },
                legend: {
                    enabled: chartObj.multi // 범례 설정
                },
                tooltip: {
                    formatter: tooltipFormatter
                },
                series: seriesData
            };

            setChartData(transformedData);
        }
    });
    /**
     * 차트 생성시 callback함수
     * @param chart 
     */
    const handleChartCreated = (chart: Chart) => {

    };
    /**
     * resize관련 useEffect, 삭제 시에 리사이즈가 안된다.
     */
    useEffect(() => {
        console.log('instance', chartRef.current, widgetRef?.current?.clientWidth);
        const width = widgetRef?.current?.clientWidth;
        const height = widgetRef?.current?.clientHeight;
        if (width) setChartWidth(width);
        if (height) setChartHeight(height);
        refetch();


    }, [chartRef.current, widgetRef, isResized]);


    if (isLoading || !chartData) return <div>Loading...</div>;

    return (
        <ChartContainer>
            <BaseChart options={chartData} ref={chartRef} handleChartCreated={handleChartCreated} />


        </ChartContainer>

    )
};
export default React.memo(BarColChart);
