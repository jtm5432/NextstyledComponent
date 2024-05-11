import React, { useState, useEffect } from 'react';
import { QueryBuilder } from 'react-querybuilder';
import 'react-querybuilder/dist/query-builder.css';
import DatalistInput from '../../atoms/DataList';
import useDebounce from '../../../app/hooks/debounce';
import { useQuery } from 'react-query'; // Import useQuery from react-query
interface Field {
  name: string;
  label: string;
  type: 'datetime' | 'string' | 'number';
  operators?: Operator[];
}
interface Operator {
  name: string;
  label: string;
}

interface Query {
  combinator: 'and' | 'or';
  rules: Field[];
}

const initialQuery: Query = {
  combinator: 'and',
  rules: [], // This is correct, but ensure you define the type for the state
};
const QueryBuilderComponent = () => {
  const operatorMappings = {
    'datetime': [
      { name: 'between', label: 'Between' },
      { name: 'before', label: 'Before' },
      { name: 'after', label: 'After' },
      { name: 'on', label: 'On' }
    ],
    'string': [
      { name: 'equals', label: 'Equals' },
      { name: 'contains', label: 'Contains' },
      { name: 'begins_with', label: 'Begins with' },
      { name: 'ends_with', label: 'Ends with' }
    ],
    'number': [
      { name: 'equals', label: 'Equals' },
      { name: 'greater_than', label: 'Greater than' },
      { name: 'less_than', label: 'Less than' },
      { name: 'not_equal', label: 'Not equal' }
    ]
  };
  

  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState<Query>(initialQuery); // Now, TypeScript knows what `query` looks like.

  const [selectedIndices, setSelectedIndices] = useState([]); // State to hold the selected indices
  const [selectedField, setSelectedField] = useState<string>('');

  const { data: fieldData, isLoading } = useQuery<Field[]>(
    ['fetchFields', selectedIndices], 
    () => fetchFields(selectedIndices),
    { enabled: !!selectedIndices.length }
  );
    // Dummy function to simulate fetching fields
    const fetchFields = async (indices: number[]): Promise<Field[]> => {
      // Simulated fetch logic
    //  return indices.map(index => allFields[index]);
    };
    const indexOption = {
      'model': ['Model 1', 'Model 2'],
      'trainingdata': ['Data 1', 'Data 2'],
      'trainingsetting': ['Setting 1', 'Setting 2']
    };
    const allFields: Field[] = [
   
      { name: '@timestamp', label: 'Timestamp', type: 'datetime' },
      { name: 'firewall.dst.keyword', label: 'Firewall Destination', type: 'string' },
      { name: 'firewall.action', label: 'Firewall Action', type: 'string' },
      { name: 'facility', label: 'Facility', type: 'number' },
      // Add more fields as required
    ];

    const options = {
      '@timestamp': [
        '2024-01-01T00:00:00',
        '2024-01-02T00:00:00',
        '2024-01-03T00:00:00',
        '2024-01-04T00:00:00'
      ],
      'firewall.dst.keyword': [
        '192.168.1.1',
        '192.168.1.2',
        '10.0.0.1',
        '10.0.0.2'
      ],
      'firewall.action': [
        'allow',
        'deny',
        'block',
        'monitor'
      ],
      'facility': [
        '101',
        '102',
        '201',
        '202'
      ]
    };
    const displayFields = selectedField
    ? allFields.filter(field => field.name === selectedField).map(field => ({
        ...field,
        operators: operatorMappings[field.type]
      }))
    : [];

    useEffect(() => {
      if (fieldData) {
        setQuery(current => ({
          ...current,
          rules: fieldData.map(field => ({
            ...field,
            operators: operatorMappings[field.type]
          }))
        }));
      }
    }, [fieldData]);
  
  


  //const debouncedQuery = useDebounce(query, 500); // Adjust delay as needed

  const handleQueryChange = useDebounce((newQuery) => {
    setQuery(newQuery);
  }, 500); // Adjust the debounce delay as necessary

  const onClose = () => {
    setIsOpen(false);
  };

  const onSave = () => {
    console.log("Saving query:", query);
    onClose();
  };
  const fields = [
    { name: '@timestamp', label: 'Timestamp', type: 'datetime' },
    { name: 'firewall.dst.keyword', label: 'Firewall Destination', type: 'string' },
    { name: 'firewall.action', label: 'Firewall Action', type: 'string' },
    { name: 'facility', label: 'Facility', type: 'number' }
  ].map(field => ({
    ...field,
    operators: operatorMappings[field.type]  // Dynamically assign operators based on field type
  }));
 // if (!isOpen) return null;

  return (
    <div style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '5px', margin: '20px', backgroundColor: '#f9f9f9' }}>
      <h2>Customize Your Query</h2>
      <div>
      <label htmlFor="field-selector">Select Field:</label>
      <select
        id="field-selector"
        value={selectedField}
        onChange={(e) => setSelectedField(e.target.value)}
      >
        <option value="">Select a field</option>
        {allFields.map((field, index) => (
          <option key={index} value={field.name}>{field.label}</option>
        ))}
      </select>
    </div>
      <QueryBuilder fields={displayFields} query={query} 
        onQueryChange={handleQueryChange} 
        controlElements={{
          valueEditor: (props) => {
            // if (props.fieldData.type === 'string' || props.fieldData.type === 'datetime') {
              return <DatalistInput 
                        field={props.field} 
                        value={props.value} 
                        onChange={(newValue) => props.handleOnChange(newValue)} 
                        options={options}
                      />;
            // }
            // 기본적으로 텍스트 입력 필드를 사용
          }
        }}
        />
      <div style={{ marginTop: '20px' }}>
        <button onClick={onSave} style={{ marginRight: '10px' }}>Save</button>
        <button onClick={onClose}>Cancel</button>
      </div>
    </div>
  );
};

export default QueryBuilderComponent;
