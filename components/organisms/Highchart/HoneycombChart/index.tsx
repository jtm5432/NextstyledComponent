import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { useQuery } from 'react-query';
import { useRecoilState } from 'recoil';
import { infoBarState } from '../../../../app/state/InfoModal'; // 경로는 실제 프로젝트 구조에 맞게 수정하세요
import { getDataByQueryDSL } from '../../../../app/queries/providerDashboard';
import { MdSettings } from 'react-icons/md';
import HoneycombInfoComponent from './combInfoModal'; // HoneycombInfoComponent를 import
import QueryLinechartTable from '../../../templates/QueryLinechartTable';
import bottomModalTemplate from '../../../templates/bottomModalTemplate';
import './styles.css';

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
    const [legendDataLeft, setLegendDataLeft] = useState([]);
    const [legendDataRight, setLegendDataRight] = useState([]);
    const [visibleLegends, setVisibleLegends] = useState({});
    const [statusCounts, setStatusCounts] = useState({});
    const [severityCounts, setSeverityCounts] = useState({});
    const [selectedIndex, setSelectedIndex] = useState('trainingdata');

    const SearchParams = {
        index: 'trainingdata',
        QueryDsl: query.formattedQuery,
        aggregationQuery: query.aggregationQuery
    };
    const hexRadius = 55; // 노드 크기를 고정 값으로 설정

    const { data, isLoading, error } = useQuery(['getTrainingDataByQueryDSL', query], () => getDataByQueryDSL(SearchParams), {
        refetchOnWindowFocus: false,
        enabled: !!query
    });

    const evalParams = {
        index: 'evaluationdata',
        QueryDsl: query.formattedQuery,
        aggregationQuery: query.aggregationQuery
    }
    const { data: evalData, isLoading: evalIsLoading, error: evalError } = useQuery(['getEvaluationDataByQueryDSL', query], () => getDataByQueryDSL(evalParams), {
        refetchOnWindowFocus: false,
        enabled: !!query
    });

    const eventParam = {
        index: 'infraevent',
        QueryDsl: {

            "bool": {
                "must": [
                    {
                        "range": {
                            "@timestamp": {
                                "gte": "now-10d",
                                "lte": "now"
                            }
                        }
                    },
                    {
                        "match": {
                            "infra": "AI"
                        }
                    }
                ],
                "filter": {
                    "bool": {
                        "must": []
                    }
                }
            }

        },
        aggregationQuery: query.aggregationQuery

    }
    const { data: eventData, isLoading: eventLoading, error: eventError } = useQuery(['getEventDataByQueryDSL', query], () => getDataByQueryDSL(eventParam), {
        refetchOnWindowFocus: false,
        enabled: !!query
    });
    const eventListParam = {
        index: 'alert',
        QueryDsl: {

            "bool": {
                "must": [
                    {
                        "range": {
                            "@timestamp": {
                                "gte": "now-10d",
                                "lte": "now"
                            }
                        }
                    },
                    {
                        "match": {
                            "statusLabel": "발생"
                        }
                    },
                    {
                        "match": {
                            "infra": "AI"
                        }
                    }
                ],
                "filter": {
                    "bool": {
                        "must": []
                    }
                }
            }

        },
        aggregationQuery: {

            "zhost_count": {
                "terms": {
                    "field": "zhost.keyword",
                    "size": 10000 // 필요한 경우 크기를 조정하세요.
                }
            }

        }

    }
    const { data: eventlistData, isLoading: eventlistLoading, error: eventlistError } = useQuery(['getEventListDataByQueryDSL', query], () => getDataByQueryDSL(eventListParam), {
        refetchOnWindowFocus: false,
        enabled: !!query
    });
    const mergeData = (data1, data2) => {
        const map = new Map();
        if (!data1) return;
        // data1을 map에 추가하고 trainingData 속성으로 저장
        data1.forEach(item => {
            map.set(item._id, { _id: item._id, trainingData: { ...item } });
        });

        // data2를 map에 추가하고 evaluation 속성으로 저장
        data2.forEach(item => {
            if (map.has(item._id)) {
                // 기존의 trainingData와 새로운 evaluation을 병합
                const existingData = map.get(item._id);
                map.set(item._id, { ...existingData, evaluation: { ...item } });
            } else {
                // 새로운 id의 경우 trainingData는 비어있고 evaluation만 추가
                map.set(item._id, { _id: item._id, evaluation: { ...item } });
            }
        });

        const result = Array.from(map.values());

        return result;
    };

    const calculateCounts = (data) => {
        const statusCountMap = {};
        const severityCountMap = {};

        data.forEach(item => {
            const trainingStatus = item.trainingData ? item.trainingData._source.status : null;
            const evaluationStatus = item.evaluation ? item.evaluation._source.status : null;

            if (trainingStatus) {
                statusCountMap[trainingStatus] = (statusCountMap[trainingStatus] || 0) + 1;
            }
            if (evaluationStatus) {
                statusCountMap[evaluationStatus] = (statusCountMap[evaluationStatus] || 0) + 1;
            }

            const matchedEvent = eventData?.data?.data.find(event => {
                const zhost = event._source.zhost && event._source.zhost.toLowerCase();
                const id = item._id && item._id.toLowerCase();
                return zhost && id && id.includes(zhost);
            });

            const severity = matchedEvent ? matchedEvent._source.severity : null;
            if (severity !== null) {
                severityCountMap[`Severity ${severity}`] = (severityCountMap[`Severity ${severity}`] || 0) + 1;
            } else {
                severityCountMap['Severity 0'] = (severityCountMap['Severity 0'] || 0) + 1;
            }
        });

        setStatusCounts(statusCountMap);
        setSeverityCounts(severityCountMap);
    };

    useEffect(() => {
        if (data && data.data && evalData && evalData.data) {
            const mergedData = mergeData(data.data.data, evalData.data.data);

            // visibleLegends 상태를 초기화합니다.
            const initialVisibleLegends = {};
            mergedData.forEach(item => {
                const status = item.trainingData ? item.trainingData._source.status : null;
                if (status) initialVisibleLegends[status] = true;
            });
            setVisibleLegends(initialVisibleLegends);
            calculateCounts(mergedData);
            // 필터링된 데이터를 업데이트하지 않고, 상태 초기화만 합니다.
            setChartData(mergedData);
        }
    }, [data, evalData, eventData, eventlistData]);

    useEffect(() => {
        if (data && data.data && evalData && evalData.data && eventData && eventData.data) {
            const mergedData = mergeData(data.data.data, evalData.data.data);
            console.log('visibleLegends', visibleLegends, mergedData);

            // visibleLegends 상태에 따라 데이터를 필터링합니다.
            const filteredData = mergedData.filter(item => {
                const trainingStatus = item.trainingData ? item.trainingData._source.status : null;
                const evaluationStatus = item.evaluation ? item.evaluation._source.status : null;

                // eventData에서 해당 항목의 severity 값을 찾습니다.
                const matchedEvent = eventData.data.data.find(event => {
                    const zhost = event._source.zhost && event._source.zhost.toLowerCase();
                    const id = item._id && item._id.toLowerCase();
                    return zhost && id && id.includes(zhost);
                });

                const severity = matchedEvent ? matchedEvent._source.severity : null;
                console.log('severity', severity)
                const isTrainingVisible = trainingStatus ? visibleLegends[trainingStatus] !== false : true;
                const isEvaluationVisible = evaluationStatus ? visibleLegends[evaluationStatus] !== false : true;
                const isSeverityVisible = severity !== null ? visibleLegends[`Severity ${severity}`] !== false : visibleLegends[`Severity 0`] !== false;

                return isTrainingVisible && isEvaluationVisible && isSeverityVisible;
            });

            setChartData(filteredData);
        }
    }, [visibleLegends]);

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


    useEffect(() => {
        const legendData1 = eventData ? [
            { label: '정상', name: 'Severity 0', color: 'green' },
            { label: '무해', name: 'Severity 1', color: 'blue' },
            { label: '주의', name: 'Severity 2', color: 'yellow' },
            { label: '위험', name: 'Severity 3', color: 'orange' },
            { label: '긴급', name: 'Severity 4', color: 'purple' },
            { label: '치명', name: 'Severity 5', color: 'red' }
        ] : [];
        const legendData2 = chartData ? [
            { label: '미학습', name: '미학습', color: '#FFFFFF' },
            { label: '학습 중', name: '학습 중', color: '#0060F0' },
            { label: '학습 완료', name: '학습 완료', color: '#00DFB7' },
            { label: '학습 실패', name: '학습 실패', color: '#FF1818' },
            { label: '학습 중지', name: '학습 중지', color: '#9E9E9E' },
            { label: '중지', name: '중지', color: '#FFFFFF' },
            { label: '예측 중', name: '예측 중', color: '#0060F0' },
            { label: '예측 완료', name: '예측 완료', color: '#00DFB7' },
            { label: '예측 실패', name: '예측 실패', color: '#FF1818' },
            { label: '예측 중지', name: '예측 중지', color: '#9E9E9E' }
        ] : [];

        setLegendDataLeft(legendData1);
        setLegendDataRight(legendData2);
    }, [eventData, chartData]);

    /**
     * 서비스, 모델 토글
     * @param index  클릭 한 버튼 정보
     */
    const handleIndexToggle = (index) => {
        console.log('INDEX', index)
        if (selectedIndex !== index) {
            setSelectedIndex(index);
            // 추가적인 UI 이벤트 또는 시각적 피드백을 여기서 처리할 수 있습니다.
        }
    };

    const renderLegend = (legendData, title) => (
        <div className="legend legendModel">
            <ul>
                {legendData.map((item, index) => (
                    <li key={index}>
                        <button
                            className={`legend-item ${visibleLegends[item.name] === false ? 'disabled' : ''}`}
                            onClick={() => handleLegendClick(item)}
                            title={`총 ${severityCounts[item.name] || 0} 개`}
                        >
                            <span
                                className="legend-color"
                                style={{ backgroundColor: item.color, width: '20px', height: '20px' }}
                            ></span>
                            {item.label}
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );

    const renderModelLegend = (legendData) => (
        <div className="legend legendModel">
            <ul>
                {legendData.slice(0, 5).map((item, index) => (
                    <li key={index}>
                        <button
                            className={`legend-item ${visibleLegends[item.name] === false ? 'disabled' : ''}`}
                            onClick={() => handleLegendClick(item)}
                            title={`총 ${statusCounts[item.label] || 0} 개`}
                        >
                            <span
                                className="legend-color"
                                style={{ backgroundColor: item.color, width: '20px', height: '20px' }}
                            ></span>
                            {item.label}
                        </button>
                    </li>
                ))}
            </ul>
            <ul>
                {legendData.slice(5).map((item, index) => (
                    <li key={index}>
                        <button
                            className={`legend-item ${visibleLegends[item.name] === false ? 'disabled' : ''}`}
                            onClick={() => handleLegendClick(item)}
                            title={`총 ${statusCounts[item.label] || 0} 개`}
                        >
                            <span
                                className="legend-color"
                                style={{ backgroundColor: item.color, width: '20px', height: '20px' }}
                            ></span>
                            {item.label}
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );

    const handleLegendClick = (item) => {
        setVisibleLegends(prevState => {
            const newState = {
                ...prevState,
                [item.name]: !prevState[item.name]
            };
            return newState;
        });
    };

    const toggleSettings = () => {
        setSettingsOpen(!isSettingsOpen);
    };

    const generateFixedGridData = (numCols: number, numRows: number): DataPoint[] => {
        const NodeGap = 1.1; // 노드 사이의 간격
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
            const getBackgroundColor = (data) => {
                console.log('getBackgroundColor', data)
                if (!data) return "#FFFFFF"
                const status = data["_source"].status;
                switch (status) {
                    case "학습 중":
                    case "예측 중":
                        return "#0060F0"; // 학습중, 예측중
                    case "학습 완료":
                    case "예측 완료":
                        return "#00DFB7"; // 완료
                    case "학습 실패":
                    case "예측 실패":
                        return "#FF1818"; // 실패
                    case "학습 정지":
                    case "예측 정지":
                        return "#9E9E9E"; // 정지
                    default:
                        return "#FFFFFF"; // 미학습
                }
            };
            const getNodeColor = (data) => {
                console.log('data', data, eventData);
                if (!data || !eventData.data) return "#FFFFFF";

                const model = data["_source"].model;

                // eventData에서 _source.zhost가 data._id에 포함되는 항목을 찾기
                const matchedEvent = eventData.data.data.find(event => {
                    const zhost = event._source.zhost && event._source.zhost.toLowerCase();
                    const id = data._id && data._id.toLowerCase();
                    return zhost && id && id.includes(zhost);
                });
                //if(matchedEvent)console.log('matchedEvent',matchedEvent._source.severity)
                if (matchedEvent) {
                    console.log('matchedEvent', matchedEvent._source.severity);
                    const severity = matchedEvent._source.severity;
                    // severity 값에 따른 색상 반환
                    switch (severity) {
                        case 0:
                            return "green";
                        case 1:
                            return "blue";
                        case 2:
                            return "yellow";
                        case 3:
                            return "orange";
                        case 4:
                            return "purple";
                        case 5:
                            return "red";
                        default:
                            return "#FFFFFF";
                    }
                }

                // 조건에 맞는 항목이 없을 경우 기본 색상 반환
                return "green";
            };

            svg.append("g")
                .selectAll("g")
                .data(bins)
                .enter().append("g")
                .attr("transform", d => `translate(${d.x}, ${d.y})`)
                .each(function (d) {
                    const points = getHexagonPoints(0, 0, hexRadius);
                    const { left, right } = splitHexagonPoints(points);

                    // 오른쪽 폴리곤
                    d3.select(this).append("polygon")
                        .attr("points", left.map(p => p.join(",")).join(" "))
                        .attr("fill", d => getBackgroundColor(d?.data?.evaluation))
                        .attr("stroke", "none");

                    // 왼쪽 폴리곤
                    d3.select(this).append("polygon")
                        .attr("points", right.map(p => p.join(",")).join(" "))
                        .attr("fill", d => getBackgroundColor(d?.data?.trainingData))
                        .attr("stroke", "none");

                    // 내부 폴리곤
                    const innerPoints = getHexagonPoints(0, 0, hexRadius * 0.9); // 크기 조정
                    d3.select(this).append("polygon")
                        .attr("points", innerPoints.map(p => p.join(",")).join(" "))
                        .attr("fill", d => getNodeColor(d?.data?.trainingData))
                        .on("click", (event) => {
                            console.log('nodeClick', d.data)
                            event.stopPropagation();
                        });

                    // 각 row의 텍스트를 반환하는 함수 정의
                    const createGetRowText = (type) => (data, rowIndex) => {
                        console.log('createGetRowText', data, eventlistData?.data);
                        if (!data || !data.trainingData) return `Row ${rowIndex + 1}`;
                        const zhostCount = eventlistData?.data?.aggregations?.zhost_count;
                        const zhostValue = data?.evaluation?._source?.zhost;

                        const matchingBucket = zhostCount?.buckets.find(bucket => bucket.key === zhostValue);
                        const docCount = matchingBucket ? matchingBucket.doc_count : 0;

                        console.log('createGetRowText', docCount);

                        switch (type) {
                            case 'model':
                                switch (rowIndex) {
                                    case 0:
                                        return `${zhostValue}`
                                    case 1:
                                        return `${docCount}`;
                                    case 2:
                                        return `${data.trainingData._source.model}`;
                                    default:
                                        return `Row ${rowIndex + 1}`;
                                }
                            case 'servce':
                                switch (rowIndex) {
                                    case 0:
                                        return `Manufacturer: ${data.trainingData._source.manufacturer}`;
                                    case 1:
                                        return `Model: ${data.trainingData._source.model}`;
                                    case 2:
                                        return `Year: ${data.trainingData._source.year}`;
                                    default:
                                        return `Row ${rowIndex + 1}`;
                                }
                        }
                    };

                    // 패딩 값 정의
                    const padding = hexRadius * 0.15;

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
                        .style("justify-content", "center")
                        .style("padding", `${padding}px`) // 전체 div에 패딩 추가
                        .style("box-sizing", "border-box"); // 패딩 포함

                    // 'model', 'manufacturer', 'year'와 같은 타입을 사용하여 클로저 생성
                    const getRowText = createGetRowText('model'); // 예시로 'model' 타입을 사용

                    // 각 row를 추가
                    for (let i = 0; i < 3; i++) {
                        const rowClass = i === 0 ? 'top-row' : i === 1 ? 'middle-row' : 'bottom-row';

                        const row = foreignObject.append("div")
                            .classed(rowClass, true) // 가운데 글자에만 'middle-row' 클래스 추가
                            .style("flex", "1")
                            .style("display", "flex")
                            .style("align-items", "center")
                            .style("justify-content", "center")
                            .style("font-size", i === 1 ? `calc(${hexRadius * 0.3}px)` : `calc(${hexRadius * 0.2}px)`) // 가운데 글자는 1.5배 크기
                            .style("font-weight", i === 1 ? "bold" : "normal") // 가운데 글자는 bold
                            .style("overflow", "hidden") // 텍스트가 넘치면 숨기기
                            .style("white-space", "nowrap") // 텍스트를 한 줄로 유지
                            .style("text-overflow", "ellipsis") // 넘친 텍스트를 '...'으로 표시
                            .text(getRowText(d.data, i))
                            .on("click", (event) => {
                                event.stopPropagation();
                                const tableParam = eventParam;
                                const newTerm = {
                                    term: {
                                        "zhost.keyword": `${d.data.evaluation._source.zhost}`
                                    }
                                };

                                // 동일한 `term` 조건이 있는지 확인
                                const existingTermIndex = tableParam.QueryDsl.bool.must.findIndex(
                                    (item) => item.term && item.term["zhost.keyword"] !== undefined
                                );

                                if (existingTermIndex !== -1) {
                                    // 동일한 `term` 조건이 있으면 값을 업데이트
                                    tableParam.QueryDsl.bool.must[existingTermIndex].term["zhost.keyword"] = `${d.data.evaluation._source.zhost}`;
                                } else {
                                    // 동일한 `term` 조건이 없으면 새로 추가
                                    tableParam.QueryDsl.bool.must.push(newTerm);
                                }
                                // statusLabel에 대한 기존 조건이 있는지 확인
                                const existingStatusLabelIndex = tableParam.QueryDsl.bool.must.findIndex(
                                    (item) => item.term && item.term["statusLabel"] !== undefined
                                );

                                if (existingStatusLabelIndex !== -1) {
                                    // 동일한 `statusLabel` 조건이 있으면 값을 제거
                                    tableParam.QueryDsl.bool.must.splice(existingStatusLabelIndex, 1);
                                }
                                if (i === 1) {
                                    tableParam.index = 'alert';
                                    const statusTerm = {
                                        term: {
                                            "statusLabel": "발생"
                                        }
                                    }
                                    tableParam.QueryDsl.bool.must.push(statusTerm);
                                }
                                else {
                                    tableParam.index = 'infraevent';
                                }
                                const column = [
                                    { Header: "@timestamp", accessor: "@timestamp" },
                                    { Header: "zhost", accessor: "zhost" },
                                    { Header: "alert_text", accessor: "alert_text" },
                                ];
                                console.log('nodeClick', tableParam);
                                const customProps = {
                                    SearchParams: tableParam,
                                    index: tableParam.index,
                                    column: column,
                                };
                                // columns={tableColumns} data={tableData} height={chartHeight} width={chartWidth}
                                setInfoBar({
                                    isOpen: true,
                                    content: <HoneycombInfoComponent
                                        data={d.data}
                                        CustomComponent={QueryLinechartTable}
                                        customProps={customProps}
                                        isBottom={false} // or false, depending on your requirement
                                    />,
                              
                                });
                            });
                    }
                });
        }
    }, [dimensions, chartData]);

    const BottomDiv = () => {
        const tableParam = eventParam;
        const column = [
            { Header: "@timestamp", accessor: "@timestamp" },
            { Header: "zhost", accessor: "zhost" },
            { Header: "alert_text", accessor: "alert_text" },
        ];
        const customProps = {
            SearchParams: tableParam,
            index: tableParam.index,
            column: column,
        };

        return (
            <div id="bottomDiv" style={{ position: 'fixed', bottom: 0, width: '100%', background: 'white', boxShadow: '0 -2px 8px rgba(0, 0, 0, 0.1)', zIndex: 1000 }}>
                <HoneycombInfoComponent
                    data={chartData} // 적절한 데이터를 설정하세요
                    CustomComponent={bottomModalTemplate}
                    customProps={customProps}
                    isBottom={true}
                />
            </div>
        );
    };

    return (
        <>
            {isSettingsOpen && (
                <div>
                    <h4>Chart Settings</h4>
                    <button onClick={toggleSettings}>Close Settings</button>
                </div>
            )}
            <div ref={widgetRef} style={{ position: 'relative', width: '100%', height: '100%' }}>
                <div className="legend-container">
                    <div className="legend-left">
                        <div className="index-toggle">
                            <button
                                className={`toggle-button trainingdata ${selectedIndex === 'trainingdata' ? 'active' : ''}`}
                                onClick={() => handleIndexToggle('trainingdata')}
                            >
                                서비스
                            </button>
                            <button
                                className={`toggle-button evaluationdata ${selectedIndex === 'evaluationdata' ? 'active' : ''}`}
                                onClick={() => handleIndexToggle('evaluationdata')}
                            >
                                모델
                            </button>
                        </div>
                        {renderLegend(legendDataLeft, 'Event Data')}
                        {renderModelLegend(legendDataRight)}
                    </div>
                </div>
                <svg ref={ref} style={{ width: '100%', height: '100%', position: 'relative', zIndex: 2 }} />
                <MdSettings
                    style={{
                        position: 'absolute',
                        top: '10px',
                        right: '10px',
                        cursor: 'pointer',
                        fontSize: '24px',
                        zIndex: 3
                    }}
                    onClick={toggleSettings}
                />
            </div>
            <BottomDiv /> {/* Always render BottomDiv */}
        </>
    );
};

export default HoneycombChart;
