import React, { useState, useEffect } from 'react';

const DatalistInput = ({ value, onChange, options, inputId }) => {
  const [inputValue, setInputValue] = useState(value || '');
  const [sortedOptions, setSortedOptions] = useState(options);

  const dataListId = `datalist-${Math.random().toString(36).substr(2, 9)}`;

  useEffect(() => {
    const sorted = [...options].sort((a, b) => {
    
      return 0;
    });
    console.log('sortedOptions',sortedOptions)
    setSortedOptions(sorted);
  }, [inputValue, options]);

  const handleInputChange = (e) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    onChange(newValue);
  };

  return (
    <div>
      <input
        type="text"
        list={dataListId}
        value={inputValue}
        onChange={handleInputChange}
        style={{ width: '100%' }}
        id={inputId}      />
      <datalist id={dataListId}>
        {sortedOptions.map((option) => (
          <option key={option.id} value={option.value} />
        ))}
      </datalist>
    </div>
  );
};

export default DatalistInput;
