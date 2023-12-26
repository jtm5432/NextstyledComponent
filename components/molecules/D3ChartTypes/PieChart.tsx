// components/molecules/PieChart.tsx
import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

interface PieChartProps {
    width: number;
    height: number;
    data: [any];

}

const PieChart: React.FC<PieChartProps> = ({ data, width, height }) => {

    const ref = useRef(null);

    useEffect(() => {
        if (data && ref.current) {
            const svg = d3.select(ref.current)
                .attr("width", width)
                .attr("height", height);

            // Set up your pie chart rendering logic here
            // Example: svg.append(...) and other D3 operations

        }
    }, [data, width, height]);

    return <svg ref={ref}></svg>;
};

export default PieChart;
