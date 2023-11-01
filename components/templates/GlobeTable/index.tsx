import ReactTable from '../../organisms/ReactTable';
import React, { useState, useRef ,useEffect } from 'react';
import { useQueryClient } from 'react-query';
import { TableContainer } from './GlobeTable.styles'
type DataRow = {
    id: number;
    [key: string]: string | number;
};
interface WidgetChartProps {
    width?: number;
    height?: number;
    widgetRef?: React.RefObject<HTMLDivElement>;
    isResized?: React.ComponentState;
    columns?: any;
}
const RecentDataTable: React.FC<WidgetChartProps> = ({ width = 100, height = 100, widgetRef, isResized ,columns }) => {
    // 초기값 설정에서 widgetRef의 크기를 사용하여 초기화합니다.
    const initialWidth = widgetRef?.current?.clientWidth || width;
    const initialHeight = widgetRef?.current?.clientHeight || height;
    const [chartWidth, setChartWidth] = useState<number>(initialWidth);
    const [chartHeight, setChartHeight] = useState<number>(initialHeight);
    const queryClient = useQueryClient();
    const initialData: DataRow[] = queryClient.getQueryData('recentData') || [];
    const [recentData, setRecentData] = useState<DataRow[]>(initialData);

    useEffect(() => {
            // 데이터 변경을 구독합니다.
            const unsubscribe = queryClient.getQueryCache().subscribe(() => {
                // 'recentData' 키에 해당하는 최신 데이터를 가져옵니다.
                const updatedData = queryClient.getQueryData('recentData') as DataRow[]; // Add type assertion here
                setRecentData(updatedData);
            });
    
            // 컴포넌트가 언마운트될 때 구독을 취소합니다.
            return () => unsubscribe();
        }, [queryClient]);

    useEffect(() => {        
        const updatedWidth = widgetRef?.current?.clientWidth;
        const updatedHeight = widgetRef?.current?.clientHeight;
        if (updatedWidth) setChartWidth(updatedWidth);
        if (updatedHeight) setChartHeight(updatedHeight);
    }, [widgetRef, isResized]);
  
    const tableData = recentData ? recentData : [];

    return (
      <TableContainer>
          <ReactTable columns={columns} data={tableData} height={chartHeight} width={chartWidth} />
      </TableContainer>
    );
}

export default RecentDataTable;
