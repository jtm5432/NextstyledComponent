// components/organisms/D3Chart.js
import React, { useState, useEffect, useRef} from 'react';  
import useSocketData from '../../../app/hooks/useSocketData';
import {fetchSearchData} from '../../../app/queries/providerDashboard'
import PieChart from '../../molecules/D3ChartTypes/PieChart';
import { useQuery } from 'react-query';
export type ChartType = 'bar' | 'line' | 'pie'; 

/**
 * D3Chart component
 * @param {ChartType} chartType - The type of chart to render
 * @param {string} initialChannel - 사용할
 * @param {React.RefObject<HTMLDivElement>} widgetRef - The ref to the widget
 * @param {React.ComponentState} isResized - The state of the widget
 *  
 * @returns {React.FC} - The component
 */
interface D3ChartProps {
    chartType: ChartType;
    initialChannel: string;
    widgetRef: React.RefObject<HTMLDivElement>;
    isResized?: React.ComponentState;
}

/**
 * @param param0
 * @param param0.chartType
 * @param param0.initialChannel 
 * @returns 
 */
const D3Chart: React.FC<D3ChartProps> = ({ chartType, initialChannel, widgetRef, isResized }) => {
    const searchParams = {
        index: 'zen-{fw*',
        queryDSL: {
          size: 0, // 문서 자체는 반환하지 않음
          query: {
            bool: {
              filter: [
                { range: { '@timestamp': { gte: 'now-2m', lte: 'now' } } },
                { term: { 'firewall.action': 'drop' } }
              ]
            }
          },
          aggs: {
            dst_keyword_group: {
              terms: {
                field: 'firewall.dst.keyword',
                size: 10 // 상위 10개 결과
              },
              aggs: {
                avg_facility: {
                  avg: {
                    field: 'facility'
                  }
                }
              }
            }
          }
        }
      };
      ;
    const { data, isLoading, error } = useQuery(['searchData', searchParams], () => fetchSearchData(searchParams), {
        enabled: !!searchParams, // searchParams가 존재할 때만 쿼리를 실행합니다.
      });
    const [channel, setChannel] = useState(initialChannel);
    const chartRef = useRef<HTMLDivElement>(null);
    // const { data: socketData, error } =  useSocketData(
    //     'connect', 
    //     'me', 
    //     { mark: 'bar', stacked: true, operator: 'LogCountByHost', zhost: 'logmanager', period: 1, unit: '   ', ytitle: '호스트' },
    //   );

    // useEffect(() => {
    //     if (socketData) {
    //         console.log('getsocketData',socketData)
    //         setData(socketData as any[]);
    //     }
    // }, [socketData]);


    
    useEffect(() => {
        const handleResize = () => {
            if (chartRef.current) {
                const { width, height } = chartRef.current.getBoundingClientRect();
                
            }
        };

        window.addEventListener('resize', handleResize);
        handleResize();
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const renderChart = () => {
        const { width, height } = widgetRef.current ? widgetRef.current.getBoundingClientRect() : { width: 0, height: 0 };
        console.log('renderChart', data, width, height)
        switch (chartType) {
            case 'pie':
                return <PieChart data={[data]} width={width} height={height} />;
             default:
                return null;
        }
    };

    return (
        <div ref={chartRef}>
            {data ? renderChart() : <p>Loading data...</p>}
        </div>
    );
};

export default React.memo(D3Chart);
