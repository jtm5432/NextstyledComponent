import React, { useEffect,useRef,useState } from 'react';
import BaseChart from '../HighChartBase';
import { useQuery } from 'react-query';
import { fetchDashboardLineChart } from '../../../app/queries/providerDashboard';
import Highcharts, { Options } from 'highcharts'
interface LineChartProps {
    width?: number;
    height?: number;
}

const LineChart:  React.FC<LineChartProps> = ({ width = 100, height = 100})  => {
    const [chartData, setChartData] = useState<Options | null>(null);
    const chartRef = useRef<Highcharts.Chart | null>(null);  // 차트의 ref를 가져옵니다.
    const [chartWidth, setChartWidth] = useState<number>(width);
    const [chartHeight, setChartHeight] = useState<number>(height);
    const { data, isLoading } = useQuery<string>('dashboardLineChart', fetchDashboardLineChart, {  // data의 타입을 string으로 변경
        onSuccess: (rawData: string) => {  // rawData의 타입을 string으로 변경
            const lines = rawData.trim().split("\n");
            const headers = lines[0].split(",");
            const datasets: { label: string, data: { x: string, y: number }[] }[] = headers.slice(1).map(ip => ({ label: ip, data: [], borderColor: '...색상...', fill: false }));

            lines.slice(1).forEach(line => {
                const values = line.split(",");
                const timestamp = values[0];
                datasets.forEach((dataset, index) => {
                    dataset.data.push({ x: timestamp, y: parseFloat(values[index + 1]) });
                });
            });

            const transformedData: Options = {
                chart: {
                    width: chartWidth,  // 여기에 width를 설정
                    height: chartHeight  // 여기에 height를 설정
                },
                xAxis: {
                    categories: datasets[0]?.data.map(item => item.x) || []  // 첫 번째 데이터셋에서 x 값들을 카테고리로 사용
                },
                series: datasets.map(dataset => ({
                    type: 'line',
                    name: dataset.label,
                    data: dataset.data.map(item => item.y)
                }))
            };

            setChartData(transformedData);
        }
    });
    useEffect(() => {
        if (chartRef.current) {
            const chart = chartRef.current;
            if (typeof chart.reflow === 'function') {
                chart.reflow();  // 차트의 크기를 재조정합니다.
            }
        }
    }, [data]);
    useEffect(() => {
        console.log('chartWidth', chartWidth, 'chartHeight', chartHeight)
        if (chartRef.current) {
            chartRef.current.setSize(width, height, false);
        }
    }, [width, height]);
    if (isLoading || !chartData) return <div>Loading...</div>;

    return (
        
        <BaseChart options={chartData} />

    )
};

export default LineChart;
