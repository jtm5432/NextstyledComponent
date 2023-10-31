import React,{useEffect} from 'react';
import { useTable } from 'react-table';
import styled from 'styled-components';
// StyledTable 컴포넌트의 props 타입을 정의합니다.
interface StyledTableProps {
    tableWidth: string | number;
    tableHeight: string | number;
}
const StyledTable = styled.div<StyledTableProps>`
    table {
          border-collapse: collapse;
          
        table-layout: fixed;
        word-wrap: break-word;
    }

    th,
    td {
        padding: 2px 4px;
        border: 1px solid #e0e0e0;
        word-wrap: break-word;
    }

    th {
        background-color: #f5f5f5;
        font-weight: bold;
        word-wrap: break-word;
    }

    tbody tr:hover {
        background-color: #f0f0f0;
        word-wrap: break-word;
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


    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        prepareRow
    } = useTable({ columns, data });

    //console.log('Table dimensions:', tableWidth, tableHeight);
   
    return (
        <div>
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
                            <tr {...row.getRowProps()} style={{ ':hover': { backgroundColor: '#f0f0f0' } }}>
                                {row.cells.map(cell => (
                                    <td {...cell.getCellProps()} style={{ padding: '2px 4px', border: '1px solid #e0e0e0' }}>
                                        {cell.render('Cell')}
                                    </td>
                                ))}
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
}

export default ReactTableComponent;
