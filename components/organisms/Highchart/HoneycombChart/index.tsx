import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { hexbin as d3Hexbin } from 'd3-hexbin';
import { useQuery } from 'react-query';
import { fetchDeepAr } from '../../../../app/queries/providerDashboard';
import { JsonParse } from '../../../../../../GLOBAL';
import { MdSettings } from 'react-icons/md'; // Import the settings icon from Material Design

interface DataPoint {
    x: number;
    y: number;
}
const HoneycombChart: React.FC = () => {
    const ref = useRef<SVGElement>(null);
    const [dimensions, setDimensions] = useState({ width: 800, height: 600 }); // Default sizes
    const [chartData, setChartData] = useState<any>(null);
    const [isSettingsOpen, setSettingsOpen] = useState(false); // 상태 관리를 위한 플래그

    // Update dimensions function
    const updateDimensions = () => {
        if (ref.current) {
            setDimensions({
                width: ref.current.clientWidth,
                height: ref.current.clientHeight
            });
        }
    };
    const colorScale = d3.scaleSequential(d3.interpolateViridis)
        .domain([0, 100]);  // Assuming data values range from 0 to 100
    // Effect to update dimensions on window resize
    useEffect(() => {
        window.addEventListener("resize", updateDimensions);
        updateDimensions(); // Initial call
        return () => window.removeEventListener("resize", updateDimensions);
    }, []);
    const { data, isLoading, refetch } = useQuery<string>('fetchDeepAr', fetchDeepAr, {
        onSuccess: (rawData) => {
           // JsonParse(rawData);
            console.log('getHoneyCombErr',JSON.parse(rawData))
            const Data = JSON.parse(rawData);
            setChartData(Data.hits.hits);

           
        },
        onError: (err) =>{
            console.log('getHoneyCombErr',err)
        }
    });
    const toggleSettings = () => {
        setSettingsOpen(!isSettingsOpen); // 설정 창 토글
    };

    // Generate Dummy Data
    const generateDummyData = (width: number, height: number, hexRadius: number, padding: number): DataPoint[] => {
        const data: DataPoint[] = [];
        const xSpacing = hexRadius * Math.sqrt(3); // Horizontal distance between centers
        const ySpacing = hexRadius * 1.5;          // Vertical distance between centers
    
        const adjustedWidth = width - 2 * padding;
        const adjustedHeight = height - 2 * padding;
    
        // Account for half the hexagon overflowing on each side
        const numCols = Math.floor((adjustedWidth - xSpacing / 2) / xSpacing);
        const numRows = Math.floor((adjustedHeight - ySpacing / 2) / ySpacing);
    
        for (let row = 0; row < numRows; row++) {
            for (let col = 0; col < numCols; col++) {
                const x = col * xSpacing + (row % 2) * (xSpacing / 2) + padding;
                const y = row * ySpacing + padding;
                data.push({ x, y });
            }
        }
        return data;
    };
    useEffect(() => {
        const padding = 20; // Define how much padding you want around your hexagons
        const radius = (Math.min(dimensions.width, dimensions.height) - 2 * padding) / 20; // Adjust radius to fit within padded dimensions
        const data = generateDummyData(dimensions.width, dimensions.height, radius, padding);
        console.log('setDim',chartData)

        if (ref.current) {
            const svg = d3.select(ref.current);
            svg.selectAll("*").remove();
    
            const hexbin = d3Hexbin<DataPoint>()
                .x(d => d.x)
                .y(d => d.y)
                .radius(radius)
                .extent([[padding, padding], [dimensions.width - padding, dimensions.height - padding]]);
    
            const bins = hexbin(data);
            if(chartData && chartData.length > 1){
                bins.forEach((bin, index) => {
                    // Example: Use index to access data assuming equal lengths or manageable indices
                    console.log('chartdata',chartData[index])
                    if(chartData[index])bin.data = chartData[index]; // Circular access if fewer data points than bins
                });
            }
            svg.attr("viewBox", `0 0 ${dimensions.width} ${dimensions.height}`)
                .append("g")
                .selectAll("path")
                .data(bins)
                .enter().append("path")
                .attr("d", hexbin.hexagon())
                .attr("transform", d => `translate(${d.x}, ${d.y})`)
                .attr("fill", d => d.data ? colorScale(d.data.value) : '#ccc') // Color based on data presence and value
                .attr("stroke", "#fff")
                .classed("no-drag", true)  // Add the no-drag class
                .on("click", function(event, d) {
                    event.stopPropagation(); // Stop the event from bubbling up to prevent unwanted interactions
                    // Display an alert with relevant data
                    if (d.data) {
                        const dstring = JSON.stringify(d.data._source);
                        const displayText = `Data value: ${dstring}`;
                        alert(displayText);
                    } else {
                        //alert("No data available for this bin.");
                    }
                });
            
        }
    }, [dimensions , chartData]);
    return (
        <>
            {isSettingsOpen && (
                <div>
                    <h4>Chart Settings</h4>
                    <button onClick={toggleSettings}>Close Settings</button>
                </div>
            )}
            <div style={{ position: 'relative', width: '100%', height: '100%' }}>
                <svg ref={ref} style={{ width: '100%', height: '100%' }} />
                <MdSettings
                    style={{
                        position: 'absolute',
                        top: '10px',
                        right: '10px',
                        cursor: 'pointer',
                        fontSize: '24px'
                    }}
                    onClick={toggleSettings}
                />
            </div>
        </>
    );
};

export default HoneycombChart;