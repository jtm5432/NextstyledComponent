import React, { useRef, useEffect } from 'react';
import styled from 'styled-components';

const Container = styled.div`
    display: flex;
    flex-direction: column;
`;

const TableRow = styled.div`
    display: flex;
    flex-direction: column;
    margin-bottom: 20px;
`;

const HoneycombInfoComponent = ({ data, SearchParams, CustomComponent, customProps }) => {
    console.log('HoneycombInfoComponent data:', data);
    console.log('HoneycombInfoComponent SearchParams:', customProps);
    const widgetRef = useRef({});
    const initialWidth = widgetRef?.current?.clientWidth ;
    const initialHeight = widgetRef?.current?.clientHeight ;

    useEffect(() => {
        console.log('HoneycombInfoComponent mounted or updated',customProps);
    }, [SearchParams]);

    return (
        <Container>
            <h2>Data Information</h2>
            {data ? (
                <div ref={widgetRef}>
                    <p><strong>이름:</strong> {data.trainingData._source.id}</p>
                    <p><strong>시간:</strong> {data.trainingData._source['@timestamp']}</p>
                    <p><strong>Model:</strong> {data.trainingData._source.model}</p>
                    <TableRow>
                        {CustomComponent ? (
                            <CustomComponent
                                widgetRef={widgetRef}
                                
                                height={initialHeight} width={initialWidth}
                                query={customProps.SearchParams}
                                index = {customProps.index}
                                column = {customProps.column}

                            />
                        ) : (
                            <p>No component provided</p>
                        )}
                    </TableRow>
                </div>
            ) : (
                <p>No data available</p>
            )}
        </Container>
    );
};

export default HoneycombInfoComponent;
