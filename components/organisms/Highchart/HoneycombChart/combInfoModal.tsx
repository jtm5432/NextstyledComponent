import React, { useRef } from 'react';
import QueryDslDataTable from '../../../templates/QueryDslTable';
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

const HoneycombInfoComponent = ({ data, SearchParams }) => {
    console.log('HoneycombInfoComponentdata', SearchParams);
    const widgetRef = useRef({});

    return (
        <Container>
            <h2>Data Information</h2>
            {data ? (
                <div ref={widgetRef}>
                    <p><strong>이름:</strong> {data._source.name}</p>
                    <p><strong>시간:</strong> {data._source['@timestamp']}</p>
                    <p><strong>Model:</strong> {data._source.model}</p>
                    <TableRow>
                        <QueryDslDataTable
                            widgetRef={widgetRef}
                            index="model"
                            query={SearchParams}
                        />
                    </TableRow>
                    <TableRow>
                        <QueryDslDataTable
                            widgetRef={widgetRef}
                            index="model"
                            query={SearchParams}
                        />
                    </TableRow>
                    <TableRow>
                        <QueryDslDataTable
                            widgetRef={widgetRef}
                            index="model"
                            query={SearchParams}
                        />
                    </TableRow>
                </div>
            ) : (
                <p>No data available</p>
            )}
        </Container>
    );
};

export default HoneycombInfoComponent;
