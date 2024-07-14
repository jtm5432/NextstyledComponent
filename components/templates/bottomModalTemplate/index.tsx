import React, { useState, useEffect } from 'react';
import { useQuery } from 'react-query';
import { TableContainer } from '../QueryDslTable/Table.styles';
import { AjaxCall } from '../../../app/queries/providerDashboard';
import AnomalyLineChart from '../../molecules/D3ChartTypes/AnomalyLineChart'; // Import the AnomalyLineChart component
import LineChart from '../../molecules/D3ChartTypes/LineChart';

interface WidgetChartProps {
    width?: number;
    height?: number;
    widgetRef?: React.RefObject<HTMLDivElement>;
    isResized?: React.ComponentState;
    index: string; // OpenSearch 인덱스
    query: any; // OpenSearch 쿼리
    column: any;
}

const bottomModalTemplate: React.FC<WidgetChartProps> = ({ width = 100, height = 100, widgetRef, isResized ,query}) => {
    const initialWidth = widgetRef?.current?.clientWidth || width;
    const initialHeight = widgetRef?.current?.clientHeight || height;
    const [chartWidth, setChartWidth] = useState<number>(initialWidth);
    const [chartHeight, setChartHeight] = useState<number>(initialHeight);

    const { data: ajaxdata, isLoading: ajaxLoading } = useQuery('AjaxCall', AjaxCall);

    const gte = query.QueryDsl.bool.must.find((item: any) => item.range && item.range["@timestamp"])?.range["@timestamp"].gte;
    const lte = query.QueryDsl.bool.must.find((item: any) => item.range && item.range["@timestamp"])?.range["@timestamp"].lte;

    const AlertParams = {
        index: 'alert',
        QueryDsl: query.QueryDsl,
        aggregationQuery: {
            "host_activity_over_time": {
                "date_histogram": {
                    "field": "@timestamp",
                    "interval": "day",
                    "format": "yyyy-MM-dd HH:mm:ss",
                    "min_doc_count": 0,
                    "extended_bounds": {
                        "min": gte,
                        "max": lte
                    }
                }
            }
        },
    };
    useEffect(() => {
        const updatedWidth = widgetRef?.current?.clientWidth;
        const updatedHeight = widgetRef?.current?.clientHeight;
        if (updatedWidth) setChartWidth(updatedWidth);
        if (updatedHeight) setChartHeight(updatedHeight);
    }, [widgetRef, isResized]);

    return (
        <TableContainer style={{ display: 'flex', flexDirection: 'column' }}>
            {ajaxLoading ? (
                <div>Loading...</div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                    <AnomalyLineChart data={ajaxdata?.data} width={chartWidth - 800} height="200px" />
                    <LineChart query={AlertParams} width={670} height="150px" colorScale="blue" />

                </div>
            )}
        </TableContainer>
    );
};

export default bottomModalTemplate;
