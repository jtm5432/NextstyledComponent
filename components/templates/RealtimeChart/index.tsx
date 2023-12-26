// components/templates/RealtimeChart.js
import React, { useState, useEffect } from 'react';


const RealtimeChart = () => {
    const [chartType, setChartType] = useState('bar');
    const [data, setData] = useState([]);

    const renderChart = () => {
        switch (chartType) {
            case 'bar':
             
            default:
                return null;
        }
    };

    return (
        <div>
        
        </div>
    );
};

export default RealtimeChart;
