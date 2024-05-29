import React, { useState, useEffect } from 'react';
import ReactTable from '../../organisms/ReactTable';
import { TableContainer } from './Table.styles';
import { useQueryClient, useQuery } from 'react-query';
import { getDataByQueryDSL } from '../../../app/queries/providerDashboard';

type DataRow = {
    id: number;
    [key: string]: string | number;
};

interface WidgetChartProps {
    width?: number;
    height?: number;
    widgetRef?: React.RefObject<HTMLDivElement>;
    isResized?: React.ComponentState;
    index: string; // OpenSearch 인덱스
    query: any; // OpenSearch 쿼리
}

const QueryDslDataTable: React.FC<WidgetChartProps> = ({ width = 100, height = 100, widgetRef, isResized, index, query }) => {
    const initialWidth = widgetRef?.current?.clientWidth || width;
    const initialHeight = widgetRef?.current?.clientHeight || height;
    const [chartWidth, setChartWidth] = useState<number>(initialWidth);
    const [chartHeight, setChartHeight] = useState<number>(initialHeight);
    const queryClient = useQueryClient();
    const [recentData, setRecentData] = useState<DataRow[]>([]);
    const [columns, setColumns] = useState<any[]>([]); // 컬럼 상태 추가

    const SearchParams = {
        index: query.index,
        QueryDsl: query.formattedQuery
    };

    const { data, isLoading, refetch } = useQuery(['getDataByQueryDSL', query], () => getDataByQueryDSL(SearchParams), {
        refetchOnWindowFocus: false,
        enabled: !!query // 쿼리가 존재할 때만 실행되도록 설정
    });
    // console.log('query transformedData',data.data);
    // const transformedData = data.data.map((hit: any) => ({
    //     id: hit._id,
    //     ...hit._source
    // }));
    useEffect(() => {
        console.log('transformedData',data)
        if (data && data.data) {
            const transformedData = data.data.map((hit: any) => ({
                id: hit._id,
                ...hit._source
            }));
            setRecentData(transformedData);

            // 컬럼을 동적으로 생성하여 상태로 설정
            if (transformedData.length > 0) {
                const newColumns = Object.keys(transformedData[0]).map(key => ({
                    Header: key,
                    accessor: key,
                    Cell: ({ value }) => typeof value === 'object' ? JSON.stringify(value) : value

                }));
                setColumns(newColumns);
            }
            console.log('transformedData',transformedData)
        } else {
            setRecentData([]);
            setColumns([]);
        }
    }, [data]);
    useEffect(() => {
        const updatedWidth = widgetRef?.current?.clientWidth;
        const updatedHeight = widgetRef?.current?.clientHeight;
        if (updatedWidth) setChartWidth(updatedWidth);
        if (updatedHeight) setChartHeight(updatedHeight);
    }, [widgetRef, isResized]);

    const dummyData: DataRow[] = [
        { id: 1, column1: 'Row 1 Data 1', column2: 'Row 1 Data 2' },
        { id: 2, column1: 'Row 2 Data 1', column2: 'Row 2 Data 2' },
        { id: 3, column1: 'Row 3 Data 1', column2: 'Row 3 Data 2' },
        { id: 4, column1: 'Row 2 Data 1', column2: 'Row 2 Data 2' },
        { id: 5, column1: 'Row 3 Data 1', column2: 'Row 3 Data 2' },
    ];
    const dummyColumns = [
        { Header: 'ID', accessor: 'id' },
        { Header: 'Column 1', accessor: 'column1' },
        { Header: 'Column 2', accessor: 'column2' },
    ];

    const tableData = recentData.length > 0 ? recentData : dummyData;
    const tableColumns = columns.length > 0 ? columns : dummyColumns;

    return (
        <TableContainer>
            {isLoading ? (
                <div>Loading...</div>
            ) : (
                <ReactTable columns={tableColumns} data={tableData} height={chartHeight} width={chartWidth} />
            )}
        </TableContainer>
    );
};

export default QueryDslDataTable;
