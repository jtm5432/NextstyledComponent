import React, { useRef, useEffect, useMemo } from 'react';
import styled from 'styled-components';
import moment from 'moment'; // 날짜 포맷팅을 위해 moment를 사용합니다.
import ReactTable from '../../ReactTable';

const Container = styled.div`
    display: flex;
    flex-direction: column;
    padding: 20px;
    border-radius: 10px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

const SectionTitle = styled.h3`
    margin: 0 0 10px 0;
    font-size: 1.2em;
    color: #333;
`;

interface HoneycombInfoComponentProps {
    data: any;
    SearchParams: any;
    CustomComponent: React.FC<any>;
    customProps: any;
    isBottom: boolean; // Add this prop to control the bottom rendering
}

const HoneycombInfoComponent: React.FC<HoneycombInfoComponentProps> = ({ data, SearchParams, CustomComponent, customProps, isBottom }) => {
    // console.log('HoneycombInfoComponent data:', data);
    // console.log('HoneycombInfoComponent SearchParams:', customProps);
    const widgetRef = useRef({});
    const initialWidth = widgetRef?.current?.clientWidth;
    const initialHeight = widgetRef?.current?.clientHeight;

    useEffect(() => {
        console.log('HoneycombInfoComponent mounted or updated', customProps);
    }, [SearchParams]);

    const formatValue = (value) => {
        if (value === null || value === undefined) {
            return 'N/A';
        }
        if (typeof value === 'string' && moment(value, moment.ISO_8601, true).isValid()) {
            return moment(value).format('YYYY-MM-DD HH:mm:ss');
        }
        if (typeof value === 'object') {
            return JSON.stringify(value);
        }
        return value.toString();
    };

    const getCombinedEntries = (trainingData, evaluationData) => {
        const combinedEntries = [];
        const allKeys = new Set([...Object.keys(trainingData), ...Object.keys(evaluationData)]);
        const keysToIgnore = ['evaluationResult', 'starttim', 'yhat_lower', 'yhat_upper', 'median', 'mean', 'endtime2'];

        allKeys.forEach(key => {
            if (!keysToIgnore.includes(key)) {
                const trainingValue = trainingData[key];
                const evaluationValue = evaluationData[key];
                combinedEntries.push({
                    key: key,
                    trainingValue: formatValue(trainingValue),
                    evaluationValue: formatValue(evaluationValue),
                });
            }
        });

        return combinedEntries;
    };

    const tableData = useMemo(() => {
        if (data && data.trainingData) {
            return getCombinedEntries(data.trainingData._source, data.evaluation._source);
        }
        return [];
    }, [data]);

    const tableColumns = useMemo(() => [
        {
            Header: 'Key',
            accessor: 'key',
        },
        {
            Header: 'Training Value',
            accessor: 'trainingValue',
        },
        {
            Header: 'Evaluation Value',
            accessor: 'evaluationValue',
        },
    ], []);

    return (
        <Container>
            {!isBottom && <h2>Data Information</h2>}
            {data ? (
                <div ref={widgetRef}>
                    {!isBottom && (
                        <>
                            <ReactTable
                                columns={tableColumns}
                                data={tableData}
                                defaultPageSize={10}
                                style={{
                                    height: "40vh",
                                    width: initialWidth
                                }}
                                className="-striped -highlight"
                            />
                        </>
                    )}
                    <div>
                        {CustomComponent ? (
                            <CustomComponent
                                widgetRef={widgetRef}
                                height={initialHeight}
                                width={initialWidth}
                                query={customProps.SearchParams}
                                index={customProps.index}
                                column={customProps.column}
                            />
                        ) : (
                            <p>No component provided</p>
                        )}
                    </div>
                </div>
            ) : (
                <p>No data available</p>
            )}
        </Container>
    );
};

export default HoneycombInfoComponent;
