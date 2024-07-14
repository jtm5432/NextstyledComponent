import React, { useState, useEffect, useRef } from 'react';
import ReactTable from '../../organisms/ReactTable';
import { TableContainer } from '../QueryDslTable/Table.styles';
import { useQueryClient, useQuery } from 'react-query';
import { getDataByQueryDSL, AjaxCall } from '../../../app/queries/providerDashboard';
import LineChart from '../../molecules/D3ChartTypes/LineChart';
import AnomalyLineChart from '../../molecules/D3ChartTypes/AnomalyLineChart';

type DataRow = {
    id: number;
    [key: string]: string | number;
};

interface WidgetChartProps {
    width?: number;
    height?: number;
    widgetRef?: React.RefElement<HTMLDiv>;
    isResized?: React.ComponentState;
    index: string; // OpenSearch 인덱스
    query: any; // OpenSearch 쿼리
    column: any;
}

const QueryDslDataTable: React.FC<WidgetChartProps> = ({ width = 100, height = 100, widgetRef, isResized, index, query, column }) => {
    const initialWidth = widgetRef?.current?.clientWidth || width;
    const initialHeight = widgetRef?.current?.clientHeight || height;
    const [chartWidth, setChartWidth] = useState<number>(initialWidth);
    const [chartHeight, setChartHeight] = useState<number>(initialHeight);
    const queryClient = useQueryClient();
    const [recentData, setRecentData] = useState<DataRow[]>([]);
    const [columns, setColumns] = useState<any[]>([]);

    const gte = query.QueryDsl.bool.must.find((item: any) => item.range && item.range["@timestamp"])?.range["@timestamp"].gte;
    const lte = query.QueryDsl.bool.must.find((item: any) => item.range && item.range["@timestamp"])?.range["@timestamp"].lte;

    const SearchParams = {
        index: query.index,
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

    const queryKey = ['getDataByQueryDSL', query.index, JSON.stringify(query.QueryDsl), JSON.stringify(query.aggregationQuery)];

    const { data, isLoading, refetch } = useQuery(queryKey, () => getDataByQueryDSL(SearchParams), {
        staleTime: 0,
        cacheTime: 10 * 60 * 1000,
        refetchOnMount: true,
        refetchOnWindowFocus: true,
    });

 

    useEffect(() => {
        if (data?.data) {
            const readdata = data.data;
            const transformedData = readdata.data.map((hit: any) => ({
                id: hit._id,
                ...hit._source
            }));
            setRecentData(transformedData);

            if (transformedData.length > 0 && !column) {
                const newColumns = Object.keys(transformedData[0]).map(key => ({
                    Header: key,
                    accessor: key,
                    Cell: ({ value }) => (typeof value === 'object' ? JSON.stringify(value) : value)
                }));
                setColumns(newColumns);
            } else if (column) {
                setColumns(column);
            }
        } else {
            setRecentData([]);
            setColumns([]);
        }
    }, [data, column]);

    useEffect(() => {
        const updatedWidth = widgetRef?.current?.clientWidth;
        const updatedHeight = widgetRef?.current?.clientHeight;
        if (updatedWidth) setChartWidth(updatedWidth);
        if (updatedHeight) setChartHeight(updatedHeight);
    }, [widgetRef, isResized]);

    useEffect(() => {
        const interval = setInterval(() => {
            refetch();
        }, 30000);

        return () => clearInterval(interval);
    }, [refetch]);

    const dummyData: DataRow[] = [
       
    ];
    const dummyColumns = [
     
    ];

    const tableData = recentData.length > 0 ? recentData : dummyData;
    const tableColumns = columns.length > 0 ? columns : dummyColumns;

    return (
        <TableContainer style={{ display: 'flex', flexDirection: 'column' }}>
            {isLoading ? (
                <div>Loading...</div>
            ) : (
                <>
                    <h2>Event Information</h2>
                    <ReactTable columns={tableColumns} data={tableData} height="40vh" width={chartWidth} />
                    {/* <LineChart query={AlertParams} width={chartWidth} height="40vh" colorScale="blue" /> */}
                    {/* <AnomalyLineChart data={ajaxdata?.data} width={chartWidth} height="40vh"  /> */}
                </>
            )}
        </TableContainer>
    );
};

export default QueryDslDataTable;
