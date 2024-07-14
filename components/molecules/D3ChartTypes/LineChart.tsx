import React, { useRef, useEffect, useState } from 'react';
import bb, { line, Chart } from 'billboard.js';
import 'billboard.js/dist/billboard.css';
import { useQuery } from 'react-query';
import { getDataByQueryDSL } from '../../../app/queries/providerDashboard';
import styled from 'styled-components';

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

const ChartContainer = styled.div<{width: number, height: number}>`
    width: ${({ width }) => width}px;
    height: ${({ height }) => height}px;

    .bb-axis-x text, .bb-axis-y text {
        fill: #ffffff; /* White color for axis labels */
    }

    .bb-axis-x line, .bb-axis-y line {
        stroke: #ffffff; /* White color for axis lines */
    }
`;

const LineChart: React.FC<LineChartProps> = ({ query, width, height, colorScale, isResized, widgetRef }) => {
    const chartRef = useRef<HTMLDivElement>(null);
    const chartInstance = useRef<Chart | null>(null);

    const [chartData, setChartData] = useState<LineChartData[]>([]);
    const [chartSize, setChartSize] = useState<{ width: number, height: number }>({ width, height });

    const SearchParams = {
        index: query.index,
        QueryDsl: query.QueryDsl,
        aggregationQuery: query.aggregationQuery
    };

    const { data, isLoading, error } = useQuery(['getDataByQueryDSL', query], () => getDataByQueryDSL(SearchParams), {
        refetchOnWindowFocus: false,
        enabled: !!query // 쿼리가 존재할 때만 실행되도록 설정
    });

    useEffect(() => {
        console.log('linechartData', data);
        if (data && data.data && data.data.aggregations) {
            const aggregationKey = Object.keys(data.data.aggregations)[0];
            const buckets = data.data.aggregations[aggregationKey].buckets;

            if (!buckets) return;

            const transformedData = buckets.map((bucket: any) => ({
                x: new Date(bucket.key),
                y: bucket.doc_count,
                tooltip: bucket.unique_values
                    ? `Unique Values:  <br>${bucket.unique_values.buckets.map((b: any) => `${b.key}: ${b.doc_count}`).join('<br>')}`
                    : `Count: ${bucket.doc_count}`
            }));

            // 데이터가 하나일 경우 빈 데이터 포인트 추가
            if (transformedData.length === 1) {
                const singlePoint = transformedData[0];
                transformedData.push({ x: new Date(singlePoint.x.getTime() + 86400000), y: 0, tooltip: 'No data' });
            }

            setChartData(transformedData);
        }
    }, [data]);

    const updateChartSize = () => {
        if (widgetRef && widgetRef.current) {
            const { clientWidth, clientHeight } = widgetRef.current;
            setChartSize({ width: clientWidth, height: clientHeight });
        } else {
            setChartSize({ width, height });
        }
    };

    useEffect(() => {
        updateChartSize();
        window.addEventListener('resize', updateChartSize);
        return () => {
            window.removeEventListener('resize', updateChartSize);
        };
    }, [widgetRef, width, height]);

    useEffect(() => {
        if (!chartData || chartData.length === 0) return;
        if (!bb || !chartRef.current) return;

        if (chartInstance.current) {
            chartInstance.current.destroy(); // 기존 차트를 파괴
        }

        chartInstance.current = bb.generate({
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
                        format: "%Y-%m-%d"
                    }
                },
                y: {
                    tick: {
                        format: "d"
                    }
                }
            },
            size: {
                width: chartSize.width,
                height: chartSize.height,
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

    }, [chartData, widgetRef, isResized, colorScale, chartSize]);

    return (
        <div>
            {isLoading ? (
                <p>Loading data...</p>
            ) : error ? (
                <p>Error loading data</p>
            ) : (
                <ChartContainer ref={chartRef} width={chartSize.width} height={chartSize.height}></ChartContainer>
            )}
        </div>
    );
};

export default LineChart;
