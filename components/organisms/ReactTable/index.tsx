import React, { useEffect } from 'react';
import { useTable } from 'react-table';
import styled, { keyframes } from 'styled-components';
import { TransitionGroup, CSSTransition } from 'react-transition-group';

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
  height: 25px;

  &.row-exit {
    animation: ${fadeOut} 0.7s ease-out;
  }
`;

const StyledTable = styled.div`
  table {
    border-collapse: collapse;
    table-layout: fixed;
    word-wrap: break-word;
    width: 100%;
  }

  th,
  td {
    padding: 2px 4px;
    border-bottom: 1px solid #e0e0e0;
    overflow: hidden; // 넘치는 내용 숨기기
    white-space: nowrap; // 내용을 한 줄에 표시
    text-overflow: ellipsis; // 넘치는 내용을 ...으로 표시
    color: white; // 텍스트 색상을 흰색으로 설정
  }

  th {
    background-color: #333; // 헤더 배경색을 어두운 회색으로 설정
    font-weight: bold;
  }

  tbody {
    display: block; // 블록 레벨 요소로 변경
    max-height: 250px; // tbody의 최대 높이 설정
    overflow-y: ${props => (props.scrollable ? 'auto' : 'hidden')}; // 스크롤 조건부 설정
    width: 100%;
  }

  thead, tbody tr {
    display: table; // table 레이아웃 유지
    width: 100%;
    table-layout: fixed; // 고정된 테이블 레이아웃 사용
  }

  tbody tr:hover {
    background-color: #444; // 행에 마우스를 올렸을 때 배경색을 어두운 회색으로 설정
  }
`;

const NoDataRow = styled.tr`
  height: 250px; // 빈 행 높이 설정
  td {
    text-align: center;
    padding: 20px;
    color: #999;
    background-color: #222; // 빈 행 배경색 설정
  }
`;

const PlaceholderRow = styled.tr`
  height: 25px; // 빈 행 높이 설정
  td {
    background-color: #222; // 빈 행 배경색 설정
  }
`;

function ReactTableComponent({ data = [], width, height, columns }) {
  const tableWidth = width ? `${width}px` : '100%';
  const tableHeight = height ? `${height}px` : '100%';

  // Ensure exactly 10 rows are displayed
  const rowsToDisplay = data.length >= 10 ? data : [...data, ...Array(10 - data.length).fill({})];

  const isScrollable = data.length > 10;

  useEffect(() => {
    // 필요한 로직 추가 가능
  }, [width, height]);

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow
  } = useTable({ columns, data: rowsToDisplay });

  return (
    <StyledTable>
      <table {...getTableProps()} style={{ width: tableWidth, maxHeight: tableHeight, borderCollapse: 'collapse' }}>
        <thead>
          {headerGroups.map(headerGroup => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map(column => (
                <th {...column.getHeaderProps()} style={{ padding: '2px 4px', border: '1px solid #e0e0e0', backgroundColor: '#333', fontWeight: 'bold' }}>
                  {column.render('Header')}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()} scrollable={isScrollable}>
          {data.length === 0 ? (
            <NoDataRow>
              <td colSpan={columns.length}>No Data Display</td>
            </NoDataRow>
          ) : (
            rows.map((row, i) => {
              prepareRow(row);
              return row.original && Object.keys(row.original).length > 0 ? (
                <CSSTransition
                  key={row.id || i}
                  timeout={700}
                  classNames="row"
                >
                  <StyledTableRow as="tr" {...row.getRowProps()}>
                    {row.cells.map(cell => (
                      <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                    ))}
                  </StyledTableRow>
                </CSSTransition>
              ) : (
                <PlaceholderRow key={i}>
                  <td colSpan={columns.length} />
                </PlaceholderRow>
              );
            })
          )}
          {data.length > 0 && data.length < 10 && (
            [...Array(10 - data.length)].map((_, i) => (
              <PlaceholderRow key={i}>
                <td colSpan={columns.length} />
              </PlaceholderRow>
            ))
          )}
        </tbody>
      </table>
    </StyledTable>
  );
}

export default ReactTableComponent;
