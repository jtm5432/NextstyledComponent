import React, { useEffect, useRef, useState } from 'react';
import BaseChart from '../HighChartBase';
import { useQuery } from 'react-query';
import { fetchDashboardBarcolChart } from '../../../../app/queries/providerDashboard';
import { Options ,Chart } from 'highcharts'
 import { ChartContainer} from '../ChartContiner.styles';
import { parsedRowData } from '../../../../app/utils/parsedRowData';

interface BarColChartProps {
    width?: number;
    height?: number;
    widgetRef?: React.RefObject<HTMLDivElement>;
    isResized?: React.ComponentState;
}

const LineChart: React.FC<BarColChartProps> = ({ width = 100, height = 100 ,widgetRef,isResized}) => {
    const [chartData, setChartData] = useState<Options | null>(null);
    const chartRef = useRef<Chart | null>(null);
    //console.log('linechart22',chartData,chartRef)

   // const ParentwidgetRef = useRef<HTMLDivElement>(widgetRef);
    const [chartWidth, setChartWidth] = useState<number>(width);
    const [chartHeight, setChartHeight] = useState<number>(height);
    const { data, isLoading,refetch  } = useQuery<string>('dashboardbarColChart', fetchDashboardBarcolChart, {  // data의 타입을 string으로 변경
        onSuccess: (rawData: string) => {  // rawData의 타입을 string으로 변경
            const lines = rawData.trim().split("\n");
            const headers = lines[0].split(",");
            /**
             * @description rawData를 파싱하여 데이터셋을 생성합니다.
             * @param rawData  
             */
            const datasets = parsedRowData(rawData);
            const transformedData: Options = {
                chart: {
                    width: chartWidth,  // 여기에 width를 설정
                    height: chartHeight  // 여기에 height를 설정
                },
                xAxis: {
                    categories: datasets[0]?.data.map(item => item.x) || []  , // 첫 번째 데이터셋에서 x 값들을 카테고리로 사용
                    tickInterval: Math.ceil(datasets[0]?.data.length / 10), // maxNumberOfTicks는 원하는 최대 라벨 수

                },
                plotOptions: {
                    area: {
                        fillOpacity: 0.5, // 영역의 채우기 불투명도 (0.0 - 1.0 사이의 값)
                    },
                },
                series: datasets.map(dataset => ({
                    type: 'bar',
                    name: dataset.label,
                    data: dataset.data.map(item => item.y)
                }))
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
        console.log('instance',chartRef.current ,widgetRef?.current?.clientWidth);
        const width = widgetRef?.current?.clientWidth;
        const height = widgetRef?.current?.clientHeight;
        if(width)setChartWidth(width);
        if(height) setChartHeight(height);
        refetch();

        
    }, [chartRef.current, widgetRef, isResized]);
 

    if (isLoading || !chartData) return <div>Loading...</div>;
    
    return (
        <ChartContainer>
            <BaseChart options={chartData} ref={chartRef} handleChartCreated={handleChartCreated} />
          

        </ChartContainer>

    )
};
export default React.memo(LineChart);
