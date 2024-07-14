import React, { useEffect, useRef } from 'react';
import bb, { areaLineRange } from 'billboard.js';
import 'billboard.js/dist/billboard.css';
import moment from 'moment';
import styled from 'styled-components';

const ChartContainer = styled.div`
  background-color: black;
  color: white;
  padding: 20px;
  border-radius: 8px;
`;

const ChartWrapper = styled.div`
  background-color: #f0f0f0;
  padding: 20px;
  border-radius: 8px;

  .bb-circle {
    display: none;  /* 점을 숨깁니다 */
  }
`;

interface AnomalyLineChartProps {
  data: {
    desc?: string;
    percent?: boolean;
    mean: [number, number][];
    range: [number, number, number][];
    meanrange: [number, number, number][];
    real: { x: number; y: number; color: string; marker: { enabled: boolean; symbol: string; radius: number } }[];
    alertlist?: { alerttime: string; severity: number }[];
  } | null;
  width: number;
  height: string; // 추가된 height props
}

const AnomalyLineChart: React.FC<AnomalyLineChartProps> = ({ data, width, height }) => {
  const chartRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (chartRef.current && data) {
      const xData = [
        "x",
        ...data.range.map(d => new Date(d[0]).toISOString()),
        ...data.meanrange.map(d => new Date(d[0]).toISOString())
      ];

      const rangeData = [
        "range",
        ...data.range.map((d, i) => [
          data.range[i][1],
          data.real[i]?.y || 0,
          data.range[i][2]
        ])
      ];

      const zeroPadding = Array(data.range.length).fill([0, 0, 0]);

      const meanrangeData = [
        "meanrange",
        ...zeroPadding,
        ...data.meanrange.map((d, i) => [
          data.meanrange[i][1],
          data.mean[i][1],
          data.meanrange[i][2]
        ])
      ];

      const tickCount = Math.max(2, Math.floor(width / 50)); // width에 따라 축 간격 동적으로 설정

      const chart = bb.generate({
        data: {
          x: "x",
          columns: [
            xData,
            rangeData,
            meanrangeData
          ],
          types: {
            range: areaLineRange(),
            meanrange: areaLineRange()
          },
          colors: {
            range: "rgba(128, 0, 128, 0.7)", // 진한 보라색
            meanrange: "rgba(135, 206, 235, 0.7)" // 하늘색
          },
          point: {
            show: false  // 점을 비활성화
          }
        },
        axis: {
          x: {
            type: "timeseries",
            tick: {
              format: "%Y-%m-%d",
              count: tickCount, // width에 따라 축 간격 동적으로 설정
              fit: false // 축 간격을 width에 맞게 설정
            }
          }
        },
        bindto: chartRef.current,
        size: {
          height: parseInt(height), // props로 받은 height 값을 사용
          width: width // props로 받은 width 값을 사용
        },
        chart: {
          background: {
            color: "#f0f0f0"
          }
        }
      });

      if (data.alertlist) {
        data.alertlist.forEach(alert => {
          const alertTime = moment(alert.alerttime).toISOString();
          const alertIndex = data.real.findIndex(d => new Date(d.x).toISOString() === alertTime);
          if (alertIndex !== -1) {
            chart.load({
              columns: [
                ["alert_x", data.real[alertIndex].x],
                ["alert", data.real[alertIndex].y]
              ],
              type: "scatter",
              colors: {
                alert: ["red", "orange", "yellow"][alert.severity - 1]
              },
              point: {
                r: 5
              }
            });
          }
        });
      }
    }
  }, [data, width, height]);

  return (
    <ChartContainer>
      <span>{data ? data.desc || '이상징후 차트' : '데이터가 없습니다.'}</span>
      <ChartWrapper ref={chartRef} style={{ height }}></ChartWrapper>
    </ChartContainer>
  );
};

export default AnomalyLineChart;
