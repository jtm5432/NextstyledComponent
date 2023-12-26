export type ChartType = 'bar' | 'line' | 'pie'; 
// components/organisms/D3Chart.js
import React, { useState, useEffect, useRef, FC } from 'react';
import useSocketData from '../../../app/hooks/useSocketData';
import PieChart from '../../molecules/D3ChartTypes/PieChart';

interface D3ChartProps {
    chartType: ChartType;
    initialChannel: string;
}
const D3Chart: FC<D3ChartProps> = ({ chartType, initialChannel }) => {
    const [data, setData] = useState<any[]>([]); //
    const [channel, setChannel] = useState(initialChannel);
    const chartRef = useRef<HTMLDivElement>(null);
    const { data: socketData, error } =  useSocketData('firewall');

    useEffect(() => {
        if (socketData) {
            setData(socketData as any[]);
        }
    }, [socketData]);

    useEffect(() => {
        const handleResize = () => {
            if (chartRef.current) {
                const { width, height } = chartRef.current.getBoundingClientRect();
                
            }
        };

        window.addEventListener('resize', handleResize);
        handleResize();
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const renderChart = () => {
        const { width, height } = chartRef.current ? chartRef.current.getBoundingClientRect() : { width: 0, height: 0 };

        switch (chartType) {
            case 'pie':
                return <PieChart data={[data]} width={width} height={height} />;
             default:
                return null;
        }
    };

    return (
        <div ref={chartRef}>
            {data ? renderChart() : <p>Loading data...</p>}
        </div>
    );
};

export default D3Chart;
