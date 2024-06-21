import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { useQuery } from 'react-query';
import { useRecoilState } from 'recoil';
import { infoBarState } from '../../../../app/state/InfoModal'; // 경로는 실제 프로젝트 구조에 맞게 수정하세요
import { getDataByQueryDSL } from '../../../../app/queries/providerDashboard';
import { MdSettings } from 'react-icons/md';
import HoneycombInfoComponent from './combInfoModal'; // HoneycombInfoComponent를 import


interface DataPoint {
    x: number;
    y: number;
    data?: any;
}

interface HoneycombChartProps {
    query: any;
    width?: number;
    height?: number;
    colorScale?: any;
    isResized?: any;
    widgetRef?: React.RefObject<HTMLDivElement>;
}

const HoneycombChart: React.FC<HoneycombChartProps> = ({ query, width = 800, height = 600, isResized, widgetRef }) => {
    const ref = useRef<SVGElement>(null);
    const [dimensions, setDimensions] = useState({ width, height });
    const [chartData, setChartData] = useState<any>(null);
    const [isSettingsOpen, setSettingsOpen] = useState(false);
    const [infoBar, setInfoBar] = useRecoilState(infoBarState); // Recoil 상태 사용
    const colorScale = d3.scaleSequential(d3.interpolateViridis).domain([0, 100]);
    const SearchParams = {
        index: query.index,
        QueryDsl: query.formattedQuery,
        aggregationQuery: query.aggregationQuery
    };
    const hexRadius = 55; // 노드 크기를 고정 값으로 설정

    const { data, isLoading, error } = useQuery(['getDataByQueryDSL', query], () => getDataByQueryDSL(SearchParams), {
        refetchOnWindowFocus: false,
        enabled: !!query
    });

    useEffect(() => {
        if (data && data.data) {
            console.log('HoneyComdata', data);
            setChartData(data.data.data);
        }
    }, [data]);

    const updateDimensions = () => {
        if (widgetRef && widgetRef.current) {
            const { clientWidth, clientHeight } = widgetRef.current;
            setDimensions({
                width: clientWidth,
                height: clientHeight
            });
        }
    };

    useEffect(() => {
        const handleResize = () => updateDimensions();
        window.addEventListener("resize", handleResize);
        updateDimensions();
        return () => window.removeEventListener("resize", handleResize);
    }, [widgetRef]);

    const toggleSettings = () => {
        setSettingsOpen(!isSettingsOpen);
    };

    const generateFixedGridData = (numCols: number, numRows: number): DataPoint[] => {
        const NodeGap = 1.1 ; // 노드 사이의 간격
        const data: DataPoint[] = [];
        const xSpacing = hexRadius * Math.sqrt(3) * NodeGap; // 간격 조정
        const ySpacing = hexRadius * 1.5 * NodeGap; // 간격 조정
        const startX = hexRadius * Math.sqrt(3); // 좌우 패딩 추가
        const startY = hexRadius; // 상단 패딩 추가

        for (let row = 0; row < numRows; row++) {
            for (let col = 0; col < numCols; col++) {
                const x = startX + col * xSpacing + (row % 2) * (xSpacing / 2);
                const y = startY + row * ySpacing;
                data.push({ x, y });
            }
        }
        return data;
    };

    const getHexagonPoints = (x, y, radius) => {
        const angle = Math.PI / 3;
        const points = [];
        for (let i = 0; i < 6; i++) {
            const x_i = x + radius * Math.cos(angle * i - Math.PI / 2); // 각도를 조정하여 회전 없이 그리기
            const y_i = y + radius * Math.sin(angle * i - Math.PI / 2); // 각도를 조정하여 회전 없이 그리기
            points.push([x_i, y_i]);
        }
        return points;
    };

    const splitHexagonPoints = (points) => {
        const midIndex = Math.floor(points.length / 2);
        const leftPoints = points.slice(0, midIndex + 1).concat([[0, 0]]);
        const rightPoints = [[0, 0]].concat(points.slice(midIndex), [points[0]]); // 마지막 꼭지점을 추가하여 닫음
        return {
            left: leftPoints,
            right: rightPoints
        };
    };

    useEffect(() => {
        const numCols = 10;
        const numRows = 8;
        const gridData = generateFixedGridData(numCols, numRows);

        if (ref.current) {
            const svg = d3.select(ref.current);
            svg.selectAll("*").remove();

            // SVG 크기를 설정하지만 뷰박스를 고정된 값으로 설정
            svg.attr("width", 1000)
                .attr("height", 600)
                .attr("viewBox", `0 0 ${numCols * hexRadius * Math.sqrt(3) * 1.25} ${numRows * hexRadius * 1.5 * 1.25}`)
                .attr("preserveAspectRatio", "xMidYMid meet");

            // 그리드 데이터와 차트 데이터를 매핑하여 bins에 데이터 할당
            const bins = gridData.map((point, index) => ({
                ...point,
                data: chartData && chartData[index] ? chartData[index] : null
            }));

            svg.append("g")
                .selectAll("g")
                .data(bins)
                .enter().append("g")
                .attr("transform", d => `translate(${d.x}, ${d.y})`)
                .each(function (d) {
                    const points = getHexagonPoints(0, 0, hexRadius);
                    const { left, right } = splitHexagonPoints(points);

                    // 왼쪽 폴리곤
                    d3.select(this).append("polygon")
                        .attr("points", left.map(p => p.join(",")).join(" "))
                        .attr("fill", "red")
                        .attr("stroke", "none");

                    // 오른쪽 폴리곤
                    d3.select(this).append("polygon")
                        .attr("points", right.map(p => p.join(",")).join(" "))
                        .attr("fill", "blue")
                        .attr("stroke", "none");

                    // 내부 폴리곤
                    const innerPoints = getHexagonPoints(0, 0, hexRadius * 0.9); // 크기 조정
                    d3.select(this).append("polygon")
                        .attr("points", innerPoints.map(p => p.join(",")).join(" "))
                        .attr("fill", d.data ? colorScale(d.data.value) : '#ccc')

                    // 각 row의 텍스트를 반환하는 함수 정의
                    const createGetRowText = (type) => (data, rowIndex) => {
                        if (!data) return `Row ${rowIndex + 1}`;
                        switch (type) {
                            case 'model':
                                switch (rowIndex) {
                                    case 0:
                                        return ``;
                                    case 1:
                                        return `115`;
                                    case 2:
                                        return `${data._source.model}`;
                                    default:
                                        return `Row ${rowIndex + 1}`;
                                }
                            case 'servce':
                                switch (rowIndex) {
                                    case 0:
                                        return `Manufacturer: ${data._source.manufacturer}`;
                                    case 1:
                                        return `Model: ${data._source.model}`;
                                    case 2:
                                        return `Year: ${data._source.year}`;
                                    default:
                                        return `Row ${rowIndex + 1}`;
                                }

                        }

                    };

                    // foreignObject를 사용하여 3줄의 row를 가진 div 요소 추가
                    const foreignObject = d3.select(this).append("foreignObject")
                        .attr("x", -hexRadius * 0.9) // 노드 안쪽에 위치하도록 조정
                        .attr("y", -hexRadius * 0.9) // 노드 안쪽에 위치하도록 조정
                        .attr("width", hexRadius * 1.8) // 노드 크기에 맞게 조정
                        .attr("height", hexRadius * 1.8) // 노드 크기에 맞게 조정
                        .append("xhtml:div")
                        .style("width", `${hexRadius * 1.8}px`) // 노드 크기에 맞게 조정
                        .style("height", `${hexRadius * 1.8}px`) // 노드 크기에 맞게 조정
                        .style("display", "flex")
                        .style("flex-direction", "column")
                        .style("align-items", "center")
                        .style("justify-content", "center");

                    // 'model', 'manufacturer', 'year'와 같은 타입을 사용하여 클로저 생성
                    const getRowText = createGetRowText('model'); // 예시로 'model' 타입을 사용
                    // 각 row를 추가
                    for (let i = 0; i < 3; i++) {
                        const row = foreignObject.append("div")
                            .classed('middle-row', i === 1) // 가운데 글자에만 'middle-row' 클래스 추가
                            .style("flex", "1")
                            .style("display", "flex")
                            .style("align-items", "center")
                            .style("justify-content", "center")
                            .style("font-size", i === 1 ? `calc(${hexRadius * 0.3}px)` : `calc(${hexRadius * 0.2}px)`) // 가운데 글자는 1.5배 크기
                            .style("font-weight", i === 1 ? "bold" : "normal") // 가운데 글자는 bold
                            .text(getRowText(d.data, i))
                            .on("click", (event) => {
                                event.stopPropagation();
                                setInfoBar({
                                    isOpen: true,
                                    content: <HoneycombInfoComponent data={d.data} SearchParams={SearchParams}/>
                                });
                            });
                    }
                })
                // .on("click", function (event, d) {
                //     event.stopPropagation();
                //     if (d.data) {
                //         const dstring = JSON.stringify(d.data._source);
                //         const displayText = `Data value: ${dstring}`;
                //         alert(displayText);
                //     }
                // });
        }
    }, [dimensions, chartData]);

    return (
        <>
            {isSettingsOpen && (
                <div>
                    <h4>Chart Settings</h4>
                    <button onClick={toggleSettings}>Close Settings</button>
                </div>
            )}
            <div ref={widgetRef} style={{ position: 'relative', width: '100%', height: '100%' }}>
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