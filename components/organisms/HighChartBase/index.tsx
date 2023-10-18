import React from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

interface BaseChartProps {
    options: Highcharts.Options;
}

const BaseChart: React.FC<BaseChartProps> = ({ options }) => {
    return <HighchartsReact highcharts={Highcharts} options={options} />;
};

export default BaseChart;
