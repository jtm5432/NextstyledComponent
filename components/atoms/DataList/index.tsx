import React from 'react';

const DatalistInput = ({ field, value, onChange ,options}) => {


  const dataListId = `datalist-${field.replace(/[\W_]+/g, '-')}`;

  return (
    <div>
      <input
        type="text"
        list={dataListId}
        value={value}
        onChange={e => onChange(e.target.value)}
        style={{ width: '100%' }}
      />
      <datalist id={dataListId}>
        {options[field]?.map(option => (
          <option key={option} value={option} />
        ))}
      </datalist>
    </div>
  );
};

export default DatalistInput;