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
interface BarSeriesOptions {
    type: 'bar';
    name?: string;
    data: number[] | [string | number, number | null][] | Highcharts.PointOptionsObject[];
}


const BarColChart: React.FC<BarColChartProps> = ({ width = 100, height = 100, widgetRef, isResized }) => {
    const [chartData, setChartData] = useState<Options | null>(null);
    const chartRef = useRef<Highcharts.Chart | null>(null);

    interface ChartObj {
        data: { [key: string]: any[] };
        multi?: boolean;
        categories?: string[];
    }

    const [chartWidth, setChartWidth] = useState<number>(width);
    const [chartHeight, setChartHeight] = useState<number>(height);
    const { data, isLoading, refetch } = useQuery<string>('dashboardbarColChart', fetchDashboardBarcolChart, {
        onSuccess: (rawData) => {
            const chartObj: ChartObj = JSON.parse(rawData); // 또는 rawData를 ChartObj 타입으로 변환하는 적절한 함수 사용

            const seriesData: BarSeriesOptions[] = chartObj?.multi ?
                Object.keys(chartObj?.data || {}).map(key => ({
                    type: "bar",
                    name: key,
                    data: chartObj.data[key].map(item => Number(item)), // 데이터를 적절한 형식으로 변환
                })) :
                [{
                    type: "bar",
                    data: Object.entries(chartObj?.data || {}).flatMap(([key, value]) => {
                        return value.map(item => Number(item)); // 데이터를 숫자 배열로 변환
                    })
                }];

            const transformedData: Options = {
                chart: {
                    type: 'bar',
                    width: chartWidth,
                    height: chartHeight
                },
                xAxis: {
                    categories: chartObj.categories
                },
                legend: {
                    enabled: chartObj.multi
                },
                series: seriesData as BarSeriesOptions[] // SeriesBarOptions 타입으로 캐스팅
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
    useEffect(() => {
        const width = widgetRef?.current?.clientWidth;
        const height = widgetRef?.current?.clientHeight;
        if (width) setChartWidth(width);
        if (height) setChartHeight(height);
        refetch();
    }, [widgetRef, isResized]);

    if (isLoading || !chartData) return <div>Loading...</div>;

    return (
        <ChartContainer>
            <BaseChart options={chartData} ref={chartRef} handleChartCreated={handleChartCreated} />
        </ChartContainer>
    );
};

export default React.memo(BarColChart);