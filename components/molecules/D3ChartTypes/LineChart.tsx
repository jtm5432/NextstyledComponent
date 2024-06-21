import React, { useRef, useEffect, useState } from 'react';
import bb, { line, Chart } from 'billboard.js';
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
    widgetRef?: React.RefObject<HTMLDivElement>;
    isResized?: React.ComponentState;
    colorScale: string;
    margin: { top: number; right: number; bottom: number; left: number };
}

const LineChart: React.FC<LineChartProps> = ({ query, width, height, colorScale, isResized,widgetRef }) => {
    const chartRef = useRef<HTMLDivElement>(null);
    const chartInstance = useRef<Chart | null>(null);

    const [chartData, setChartData] = useState<LineChartData[]>([]);
    const [chartSize, setChartSize] = useState<{ width: number, height: number }>({ width, height });

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
        if (data && data.data&& data.data.aggregations ) {
            const aggregationKey = Object.keys(data.data.aggregations)[0];
            const buckets = data.data.aggregations[aggregationKey].buckets;
        
            if(!buckets) return;
            const tooltipTitle =  query.aggregations[0].nestedField?  `${query.aggregations[0].nestedField}` : ``
            const transformedData = buckets.map((bucket: any) => ({
                x: new Date(bucket.key),
                /** nestedField가 있으면 집계 값 안에 다른 조건이 join되어있는 상태 */
                y:  bucket.doc_count, // unique_values.value를 사용
                tooltip: bucket.unique_values ? 
                    `Unique Values: ${tooltipTitle} <br>${bucket.unique_values.buckets.map((b: any) => `${b.key}: ${b.doc_count}`).join('<br>')}` : 
                    `Count: ${bucket.doc_count}`
            }));
          //   = data.data.map((hit: any) => ({
          //     x: new Date(hit._source.time), // Assuming time field is available in the data
          //     y: hit._source.value // Assuming value field is available in the data
          // }));
            setChartData(transformedData);
        }
    }, [data]);

    useEffect(() => {
        if (!chartData || chartData.length === 0) return;
        if(!bb||!chartRef.current) return;
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
                height:  height,
            },
            color: {
                pattern: [colorScale]
            },
            tooltip: {
                contents: (d: any) => {
                    const dataPoint = chartData[d[0].index];
                    return `<div class="bb-tooltip"><table><tbody><tr><th>${dataPoint.x.toString()}</th></tr><tr><td>${dataPoint.tooltip}</td></tr></tbody></table></div>`;
                }
            }
        });
    }, [chartData,widgetRef, isResized, colorScale]);


    return (
        <div>
            {isLoading ? (
                <p>Loading data...</p>
            ) : error ? (
                <p>Error loading data</p>
            ) : (
                <div ref={chartRef} style={{ width: '100%', height: '100%' }}></div>
            )}
        </div>
    );
};

export default LineChart;
