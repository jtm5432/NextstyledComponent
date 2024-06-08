import React, { useRef, useEffect, useState } from 'react';
import bb, { line } from 'billboard.js';
import 'billboard.js/dist/billboard.css';
import { useQuery } from 'react-query';
import { getDataByQueryDSL } from '../../../app/queries/providerDashboard';

interface LineChartData {
    category: string;
    display: number;
    time: number; // Assuming time is in Unix timestamp format
    tooltip: string;
    x: number;
    y: number;
}

interface LineChartProps {
    query: any; // OpenSearch query
    width: number;
    height: number;
    colorScale: string;
    margin: { top: number; right: number; bottom: number; left: number };
}

const LineChart: React.FC<LineChartProps> = ({ query, width, height, colorScale, margin }) => {
    const chartRef = useRef<HTMLDivElement>(null);
    const [chartData, setChartData] = useState<LineChartData[]>([]);
    console.log('drawlinechart',query,width,height,colorScale)
    const SearchParams = {
        index: query.index,
        QueryDsl: query.formattedQuery,
        aggregationQuery: query.aggregationQuery
    };

    const { data, isLoading, error } = useQuery(['getDataByQueryDSL', query], () => getDataByQueryDSL(SearchParams), {
        refetchOnWindowFocus: false,
        enabled: !!query // 쿼리가 존재할 때만 실행되도록 설정
    });

    useEffect(() => {
        console.log('linechartData',data)
        if (data && data.data ) {
            let transformedData; 

          //   = data.data.map((hit: any) => ({
          //     x: new Date(hit._source.time), // Assuming time field is available in the data
          //     y: hit._source.value // Assuming value field is available in the data
          // }));
            setChartData(transformedData);
        }
    }, [data]);

    useEffect(() => {
        if (!chartData || chartData.length === 0) return;

        bb.generate({
            bindto: chartRef.current,
            data: {
                json: chartData,
                keys: {
                    x: "x",
                    value: ["y"]
                },
                type: line()
            },
            axis: {
                x: {
                    type: "timeseries",
                    tick: {
                        format: "%Y-%m-%d %H:%M:%S"
                    }
                }
            },
            size: {
                width: width,
                height: height
            },
            color: {
                pattern: [colorScale]
            }
        });
    }, [chartData, width, height, colorScale]);

    return (
        <div>
            {isLoading ? (
                <p>Loading data...</p>
            ) : error ? (
                <p>Error loading data</p>
            ) : (
                <div ref={chartRef}></div>
            )}
        </div>
    );
};

export default LineChart;
