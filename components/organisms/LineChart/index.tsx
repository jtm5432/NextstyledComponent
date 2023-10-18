import React from 'react';
import BaseChart from '../HighChartBase';

interface LineChartProps {
    data: any[];
}
/**
 * 
 * @param param0 data를 받아서 LineChart를 그린다. y축은 data의 값으로 설정한다. x축은 data의 index로 설정한다.
 * @returns 
 */
const LineChart: React.FC<LineChartProps> = ({ data }) => {
    if(data===undefined) return <div>loading...</div>
    else {
        console.log('datadatadata', data);
        data = JSON.parse(data);
        const options: Highcharts.Options = {
            chart: {
                type: 'line'
            },
            series: [
                {
                    type: 'line',
                    data: data.map((value) => ({ y: value }))
                }
            ]
        };

        return <BaseChart options={options} />;
    }
};

export default LineChart;
