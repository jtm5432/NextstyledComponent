import React, { useEffect, useRef, useState } from 'react';
import BaseChart from '../HighChartBase';
import { useQuery } from 'react-query';
import { fetchDashboardLineChart } from '../../../../app/queries/providerDashboard';
import { Options ,Chart } from 'highcharts'
import { ChartContainer} from '../ChartContiner.styles';
import { parsedRowData } from '../../../../app/utils/parsedRowData';

interface LineChartProps {
    width?: number;
    height?: number;
    widgetRef?: React.RefObject<HTMLDivElement>;
    isResized?: React.ComponentState;
    linecharttype:'line'|'column'|'area'|'bar';
}
const LineChart: React.FC<LineChartProps> = ({
    width = 100,
    height = 100,
    widgetRef,
    isResized,
    linecharttype = 'line'
}) => {
    const [chartData, setChartData] = useState<Options | null>(null);
    const chartRef = useRef<Chart | null>(null);
    const [chartWidth, setChartWidth] = useState<number>(width);
    const [chartHeight, setChartHeight] = useState<number>(height);

    const { isLoading, refetch } = useQuery<string>('dashboardLineChart', fetchDashboardLineChart, {
        refetchInterval: 5000,
        onSuccess: (rawData: string) => {
            let datasets;
            if (typeof(rawData) === 'string') {
                datasets = parsedRowData(rawData);
            } else {
                datasets = rawData;
            }

            const transformedData: Options = {
                chart: {
                    type: linecharttype,
                    width: chartWidth,
                    height: chartHeight,
                    backgroundColor: 'transparent', 
                },
                xAxis: {
                    type: 'datetime'
                },
                yAxis: {
                    title: {
                        text: 'Value'
                    }
                },
                series: datasets.map(dataset => ({
                    type: "line",
                    name: dataset.label,
                    // item.x의 타입에 따라 적절한 처리를 적용
                    data: dataset.data.map(item => {
                        // item.x가 밀리초 단위의 타임스탬프인지 확인
                        const xValue = typeof item.x === 'number' ? item.x : new Date(item.x).getTime();
                        return [xValue, item.y];
                    })
                }))
            };
            

            setChartData(transformedData);
        }
    });

    useEffect(() => {
        const updateChartSize = () => {
            const width = widgetRef?.current?.clientWidth ?? chartWidth;
            const height = widgetRef?.current?.clientHeight ?? chartHeight;
            setChartWidth(width);
            setChartHeight(height);
            refetch();
        };

        updateChartSize();
    }, [widgetRef, isResized]);
    let handleChartCreated = (chart: Chart) => {    

    }
    if (isLoading || !chartData) return <div>Loading...</div>;

    return (
        <ChartContainer>
            <BaseChart options={chartData} ref={chartRef} handleChartCreated={(handleChartCreated)} />
        </ChartContainer>
    );
};

export default React.memo(LineChart);
