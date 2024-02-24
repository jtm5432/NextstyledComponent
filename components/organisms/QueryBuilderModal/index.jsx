import React, { useState } from 'react';
import { QueryBuilder } from 'react-querybuilder';
import 'react-querybuilder/dist/query-builder.css';

const QueryBuilderComponent = ({ isOpen, onClose, onSave, initialQuery }) => {
  const [query, setQuery] = useState(initialQuery || {
    combinator: 'and',
    rules: [],
  });

  // OpenSearch 쿼리에 사용될 수 있는 필드를 정의합니다.
  const fields = [
    { name: '@timestamp', label: 'Timestamp', type: 'datetime' },
    { name: 'firewall.dst.keyword', label: 'Firewall Destination', type: 'string' },
    { name: 'firewall.action', label: 'Firewall Action', type: 'string' },
    { name: 'facility', label: 'Facility', type: 'number' },
    // 필요에 따라 더 많은 필드를 추가할 수 있습니다.
  ];

  if (!isOpen) return null; // isOpen이 false면 아무것도 렌더링하지 않음

  const handleSave = () => {
    // 이곳에서 query를 OpenSearch 쿼리 DSL로 변환하는 로직을 구현해야 합니다.
    // 변환된 쿼리를 onSave 함수로 전달합니다.
    console.log("Saving query:", query);
    // onSave(transformQueryToOpenSearchDSL(query));
    onClose(); // 호출 컴포넌트에서 제공된 onClose 함수를 사용하여 UI에서 컴포넌트를 제거
  };

  return (
    <div style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '5px', margin: '20px', backgroundColor: '#f9f9f9' }}>
      <h2>Customize Your Query</h2>
      <QueryBuilder fields={fields} query={query} onQueryChange={setQuery} />
      <div style={{ marginTop: '20px' }}>
        <button onClick={handleSave} style={{ marginRight: '10px' }}>Save</button>
        <button onClick={onClose}>Cancel</button>
      </div>
    </div>
  );
};

export default QueryBuilderComponent;
