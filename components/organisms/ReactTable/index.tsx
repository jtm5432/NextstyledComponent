import React, { useEffect, useState } from 'react';
import { useTable } from 'react-table';
import styled, { keyframes } from 'styled-components';
import { TransitionGroup, CSSTransition } from 'react-transition-group';

// StyledTable 컴포넌트의 props 타입을 정의합니다.
interface StyledTableProps {
    tableWidth: string | number;
    tableHeight: string | number;
}
const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const fadeOut = keyframes`
  from { opacity: 1; }
  to { opacity: 0; }
`;
const StyledTableRow = styled.tr`
  animation: ${fadeIn} 0.7s ease-in;

  &.row-exit {
    animation: ${fadeOut} 0.7s ease-out;
  }
`;
const StyledTable = styled.div<StyledTableProps>`

    table {
          border-collapse: collapse;
          
        table-layout: fixed;
        word-wrap: break-word;
    }

    th,
    td {
        padding: 2px 4px;
        border-bottom: 1px solid #e0e0e0;
        overflow: hidden; // 넘치는 내용 숨기기
        white-space: nowrap; // 내용을 한 줄에 표시
        text-overflow: ellipsis; // 넘치는 내용을 ...으로 표시
    }

    th {
        background-color: #f5f5f5;
        font-weight: bold;
    }

    tbody tr:hover {
        background-color: #f0f0f0;
    }
    
`;
function ReactTableComponent({ data, width, height, columns }) {
    if (!columns.length || !data || !data.length || !width || !height) {
        data = []; width = '0'; height = '0';
    }
    const tableWidth = width ? `${width}px` : '100%';
    const tableHeight = height ? `${height}px` : '100%';
    useEffect(() => {
        const tableWidth = width ? `${width}px` : '100%';
        const tableHeight = height ? `${height}px` : '100%';
        // 여기서 필요한 로직을 추가할 수 있습니다.
    }, [width, height]);
    const [rowsState, setRowsState] = useState(data);



    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        prepareRow
    } = useTable({ columns, data });

    //console.log('Table dimensions:', tableWidth, tableHeight);

    return (
        <StyledTable tableWidth={tableWidth} tableHeight={tableHeight}>
            <table {...getTableProps()} style={{ width: tableWidth, maxHeight: tableHeight, borderCollapse: 'collapse', overflowY: 'auto' }}>
                <thead>
                    {headerGroups.map(headerGroup => (
                        <tr {...headerGroup.getHeaderGroupProps()}>
                            {headerGroup.headers.map(column => (
                                <th {...column.getHeaderProps()} style={{ padding: '2px 4px', border: '1px solid #e0e0e0', backgroundColor: '#f5f5f5', fontWeight: 'bold' }}>
                                    {column.render('Header')}
                                </th>
                            ))}
                        </tr>
                    ))}
                </thead>
                <tbody {...getTableBodyProps()}>
                    {rows.map(row => {
                        prepareRow(row);
                        return (
                            <CSSTransition
                                key={row.id}
                                timeout={700}
                                classNames="row"
                            >
                                <StyledTableRow as="tr" {...row.getRowProps()}>
                                    {row.cells.map(cell => (
                                        <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                                    ))}
                                </StyledTableRow>
                            </CSSTransition>
                        );
                    })}
                </tbody>
            </table>
        </StyledTable>
    );
}

export default ReactTableComponent;
