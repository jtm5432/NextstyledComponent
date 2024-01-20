import React, { useRef, useEffect } from 'react';
import * as d3 from 'd3';

interface LineChartData {
  category: string;
  display: number;
  time: number; // Assuming time is in Unix timestamp format
  tooltip: string;
  x: number;
  y: number;
}

interface LineChartProps {
  data: LineChartData[];
  width: number;
  height: number;
  colorScale: string;
  margin: { top: number; right: number; bottom: number; left: number };
}

const LineChart: React.FC<LineChartProps> = ({ data, width, height, colorScale, margin }) => {
  const ref = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!data || data.length === 0) return;

    const svg = d3.select(ref.current);
    svg.selectAll("*").remove(); // Clear svg content before adding new elements

    // Assuming 'time' is a Unix timestamp, converting it to a JavaScript Date object
    const xScale = d3.scaleTime()
      .domain(d3.extent(data, d => new Date(d.time)) as [Date, Date])
      .range([margin.left, width - margin.right]);

    const yScale = d3.scaleLinear()
      .domain([0, d3.max(data, d => d.y) as number])
      .range([height - margin.bottom, margin.top]);

    const line = d3.line<LineChartData>()
      .x(d => xScale(new Date(d.time)))
      .y(d => yScale(d.y));

    svg.append("path")
      .datum(data)
      .attr("fill", "none")
      .attr("stroke", colorScale)
      .attr("stroke-width", 2)
      .attr("d", line);

    // Add Axes
    svg.append("g")
      .attr("transform", `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(xScale));

    svg.append("g")
      .attr("transform", `translate(${margin.left},0)`)
      .call(d3.axisLeft(yScale));

  }, [data, width, height, colorScale, margin]);

  return <svg ref={ref} width={width} height={height} />;
};

export default LineChart;
