// components/organisms/D3Chart.js
import React, { useState, useEffect, useRef } from 'react';
import bb from 'billboard.js';
import 'billboard.js/dist/billboard.css';
import useSocketData from '../../../app/hooks/useSocketData';
import { fetchSearchData } from '../../../app/queries/providerDashboard';
import { useQuery } from 'react-query';
import ConfigButton from '../../organisms/ConfigButton';

export type ChartType = 'bar' | 'line' | 'pie';

interface D3ChartProps {
    chartType: ChartType;
    initialChannel: string;
    widgetRef: React.RefObject<HTMLDivElement>;
    isResized?: React.ComponentState;
}

const D3Chart: React.FC<D3ChartProps> = ({ chartType, initialChannel, widgetRef, isResized }) => {
    const [channel, setChannel] = useState(initialChannel);
    const chartRef = useRef<HTMLDivElement>(null);
    const { data: socketData } = useSocketData(
        'LogCountByHost', 
        { mark: 'bar', stacked: true, operator: 'LogCountByHost', zhost: 'logmanager', period: 1, unit: ' ', ytitle: '호스트' }
    );

    useEffect(() => {
        const handleResize = () => {
            if (chartRef.current) {
                const { width, height } = chartRef.current.getBoundingClientRect();
                bb.generate({
                    bindto: chartRef.current,
                    data: {
                        columns: formatChartData(socketData),
                        type: chartType
                    },
                    size: {
                        width,
                        height
                    }
                });
            }
        };

        window.addEventListener('resize', handleResize);
        handleResize();
        return () => window.removeEventListener('resize', handleResize);
    }, [chartType, socketData]);

    const formatChartData = (data) => {
        if (!data) return [];
        // socketData를 billboard.js 형식에 맞게 변환합니다.
        return data.map((d) => [d.label, ...d.values]);
    };

    return (
        <div ref={chartRef}>
            {socketData ? null : <p>Loading data...</p>}
        </div>
    );
};

export default React.memo(D3Chart);
