import React, { useEffect, useRef } from 'react';
import bb from 'billboard.js';
import 'billboard.js/dist/billboard.css';

interface PieChartProps {
    width: number;
    height: number;
    data: any[];
}

const PieChart: React.FC<PieChartProps> = ({ data, width, height }) => {
    const chartRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (data && chartRef.current) {
            bb.generate({
                bindto: chartRef.current,
                data: {
                    columns: data.map(d => [d.label, d.value]),
                    type: "pie"
                },
                size: {
                    width: width,
                    height: height
                }
            });
        }
    }, [data, width, height]);

    return <div ref={chartRef}></div>;
};

export default PieChart;
