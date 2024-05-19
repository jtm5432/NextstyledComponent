import React, { useState, useEffect, useRef, useCallback } from 'react';
import { QueryBuilder, formatQuery } from 'react-querybuilder';
import 'react-querybuilder/dist/query-builder.css';
import DatalistInput from '../../atoms/DataList';
import { useQuery } from 'react-query';
import { getFeildBYName, SearchByQueryDSL, saveQueryDsl } from '../../../app/queries/providerDashboard';
import { AxiosResponse } from 'axios';
import SavedQueriesComponent from '../ListComp';

interface Field {
  name: string;
  label?: string;
  type?: 'date' | 'text' | 'long';
  operators?: Operator[] | string | Promise<AxiosResponse<any, any>>;
}
interface Operator {
  name: string;
  label: string;
}

interface Query {
  combinator: 'and' | 'or';
  rules: any[];
}
interface FieldResponse {
  name: string;
  type: string;
}
const initialQuery: Query = {
  combinator: 'and',
  rules: [],
};

const QueryBuilderComponent = () => {
  const operatorMappings = {
    date: [
      { name: 'between', label: 'Between' },
      { name: 'before', label: 'Before' },
      { name: 'after', label: 'After' },
      { name: 'on', label: 'On' }
    ],
    text: [
      { name: '=', label: '=' },
      { name: 'contains', label: 'Contains' },
      { name: 'begins_with', label: 'Begins with' },
      { name: 'ends_with', label: 'Ends with' }
    ],
    long: [
      { name: '=', label: '=' },
      { name: '<', label: '<' },
      { name: '>', label: '>' },
      { name: '!=', label: '!=' }
    ]
  };

  const [isOpen, setIsOpen] = useState(false);
  const [selectedField, setSelectedField] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [fieldData, setFieldData] = useState<FieldResponse[]>([]);
  const queryRef = useRef<Query>(initialQuery);
  const [queryName, setQueryName] = useState<string>(''); // 쿼리 이름 상태 추가
  const [savedQueries, setSavedQueries] = useState([]);
  const [showSavedQueries, setShowSavedQueries] = useState(false); // 쿼리 리스트 

  const allFields: Field[] = [
    { name: 'model', label: 'model', operators: getFeildBYName },
    { name: 'trainingdata', label: 'trainingdata', operators: getFeildBYName }
  ];

  useEffect(() => {
    const getDisplayField = allFields.find(e => e.name === selectedField);
    if (getDisplayField) {
      const fetchOperators = async () => {
        setLoading(true);
        try {
          const operatorsResponse = await getFeildBYName(selectedField);
          setFieldData(operatorsResponse.map((e, index) => ({
            ...e,
            label: e.name,
            operators: operatorMappings[e.type],
            key: index
          })));
        } catch (error) {
          console.error('Error fetching field operators:', error);
        } finally {
          setLoading(false);
        }
      };

      fetchOperators();
    } else {
      setFieldData([]);
    }
  }, [selectedField]);

  const handleQueryChange = useCallback((newQuery: Query) => {
    console.log("Query changed:", newQuery);
    queryRef.current = newQuery;
    setQueryState(newQuery);
  }, []);

  const handleFieldChange = (event) => {
    const newField = event.target.value;
    setSelectedField(newField);
  };

  const [queryState, setQueryState] = useState<Query>(initialQuery);

  const onClose = () => {
    setIsOpen(false);
  };

  const onSave = async () => {
    const rawQuery = queryRef.current;

    // 필터링 로직 적용
    const formattedQuery = filterQuery(rawQuery)("elasticsearch");
    console.log("Formatted query for saving:", formattedQuery);

    // 서버에서 저장된 쿼리 리스트 불러오기
    try {
      //const savedQueries = await loadQueries();  // 예: 서버로부터 저장된 쿼리 리스트를 불러옵니다.
      let savedQueries = [];
      console.log("Saved queries loaded successfully:", savedQueries);

      // 사용자에게 저장된 쿼리 리스트를 보여주고, 새로 저장하거나 기존의 것을 덮어쓸지 선택하게 함
      const queryNameToSave = prompt('Enter the name of the query to save:');
      if (queryNameToSave) {
        const existingQuery = savedQueries.find(q => q.name === queryNameToSave);

        if (existingQuery) {
          const overwrite = confirm('A query with this name already exists. Overwrite it?');
          if (!overwrite) {
            return; // 사용자가 덮어쓰기를 원하지 않으면 함수 종료
          }
        }

        // 쿼리 저장 로직
        //await saveQuery({ name: queryNameToSave, query: formattedQuery });
        alert('Query saved successfully');
      } else {
        alert('Saving cancelled: No name provided for the query.');
      }
    } catch (error) {
      console.error('Error during query save process:', error);
      alert('Failed to load or save queries.');
    }

    onClose();  // 모달 또는 폼 닫기
  };

  /**
   * 
   * @param query queryBuilder ref에서 읽어온 값
   * @returns value값이 null이거나 ""인 경우 해당 rule을 무시한다. 
   * @param format queryBuilder에서 일겅온 값을 매핑할 포맷
   * @returns QueryDsl
   */
  const filterQuery = (query) => (format) => {
    const filterRules = rules => {
      console.log('rules', rules);
      return rules
        .filter(rule => rule.value !== null && rule.value !== "")
        .map(rule => {
          if (rule.rules) {
            return {
              ...rule,
              rules: filterRules(rule.rules)
            };
          }
          return rule;
        });
    };

    const filteredQuery = {
      ...query,
      rules: filterRules(query.rules)
    };

    return formatQuery(filteredQuery, { format: format });
  };
  const handleSelectQuery = () =>{

  }
  const handleDeleteQuery = () => {


  }
  const handleSaveQuery = async () => {
    setShowSavedQueries(!showSavedQueries); // 목록 토글

    const rawQuery = queryRef.current;
    const formattedQuery = formatQuery(rawQuery, { format: 'elasticsearch' });
    const queryNameToSave = prompt('Enter the name of the query to save:');
    if (!queryNameToSave) {
      alert('Saving cancelled: No name provided for the query.');
      return;
    }
    const queryDSLParams = {
      name : queryNameToSave,
      queryDsl : formattedQuery,

    }
    const id = Date.now();
    saveQueryDsl(id,queryDSLParams);
    /*
    const existingQuery = savedQueries.find(q => q.name === queryNameToSave);
    const shouldOverwrite = existingQuery ? confirm('A query with this name already exists. Overwrite it?') : true;
  
    if (shouldOverwrite) {
      try {
        // await saveQuery({ name: queryNameToSave, query: formattedQuery });
        // alert('Query saved successfully');
        // fetchSavedQueries(); // Refresh the list of saved queries
      } catch (error) {
        console.error('Error saving query:', error);
        alert('Error saving the query');
      }
    }
    */
  };
  
  const handleEditQuery = () => {

  }
  const onRetrieve = async (format: string) => {
    let formattedQuery;
    if (format === 'elasticsearch') {
      const rawQuery = queryRef.current;

      // 필터링 로직 적용
      formattedQuery = filterQuery(rawQuery)(format);

      // Log the formatted query to see its structure
      console.log(`Retrieved ${format} query:`, formattedQuery, queryRef.current);

      // If formattedQuery is a string, parse it into an object
      if (typeof formattedQuery === 'string') {
        formattedQuery = JSON.parse(formattedQuery);
      }

      // Include the selected field as the index in the formatted query
      const elasticsearchQuery = {
        index: selectedField,
        query: formattedQuery
      };
      console.log('Elasticsearch Query:', elasticsearchQuery);

      // Fetch data using SearchByQueryDSL
      try {
        const searchParams = {
          index: selectedField,
          body: formattedQuery
        };
        const response = await SearchByQueryDSL(searchParams);
        console.log('res', response)
        if (response.data.success) {
          // Display an alert with the retrieved data
          alert(`Retrieved Data: ${JSON.stringify(response.data.data, null, 2)}`);
        } else {
          console.error('Error retrieving data:', response);
          alert('Error retrieving data. Please check the console for more details.');
        }
        console.log('Retrieved Data:', response);
      } catch (error) {
        console.error('Error retrieving data:', error);
        alert('Error retrieving data. Please check the console for more details.');
      }
    }
  };

  const memoizedFieldSelector = useCallback((props) => (
    <DatalistInput
      value={props.value}
      onChange={(value) => props.handleOnChange(value)}
      options={fieldData.map(field => ({ id: field.name, value: field.label }))}
    />
  ), [fieldData]);

  return (
    <div style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '5px', margin: '20px', backgroundColor: '#f9f9f9' }}>
      <h2>Customize Your Query</h2>
      <label htmlFor="query-name">Query Name:</label>
      <DatalistInput
        id="query-name"
        value={queryName}
        onChange={(value) => setQueryName(value)}
        options={[]} // 데이터 리스트의 옵션을 추가할 수 있습니다.
      />
      <div>
        <label htmlFor="field-selector">Select Field:</label>
        <select
          id="field-selector"
          value={selectedField}
          onChange={handleFieldChange}
          disabled={loading}
        >
          <option value="">Select a field</option>
          {allFields.map((field, index) => (
            <option key={index} value={field.name}>{field.label}</option>
          ))}
        </select>
      </div>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <div>
          <QueryBuilder
            fields={fieldData}
            query={queryState}
            onQueryChange={handleQueryChange}
            controlElements={{ fieldSelector: memoizedFieldSelector }}
          />
          {showSavedQueries && (
            <SavedQueriesComponent
              savedQueries={savedQueries}
              onSelect={(query) => console.log('Query selected:', query)}
              onDelete={(id) => console.log('Query deleted:', id)}
              onEdit={(query) => console.log('Query edited:', query)}
            />
          )}
        </div>
      )}
      <div style={{ marginTop: '20px' }}>
        <button onClick={handleSaveQuery}>Save Query</button>
        {/* <button onClick={handleLoadQuery}>Load Query</button> */}
        <button onClick={onClose} style={{ marginRight: '10px' }}>Cancel</button>
        <button onClick={() => onRetrieve('elasticsearch')}>Retrieve Elasticsearch Query</button>
      </div>
    </div>
  );
};

export default QueryBuilderComponent;
