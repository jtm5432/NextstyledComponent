// src/components/organisms/QueryBuilder.tsx
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { QueryBuilder, formatQuery } from 'react-querybuilder';
import 'react-querybuilder/dist/query-builder.css';
import DatalistInput from '../../atoms/DataList';
import { useQuery } from 'react-query';
import { getFeildBYName, SearchByQueryDSL, saveQueryDsl, loadQueryDsl } from '../../../app/queries/providerDashboard';
import { AxiosResponse } from 'axios';
import SavedQueriesComponent from '../ListComp';
import { useRecoilState,useRecoilValue } from 'recoil';
import { chartInfoMapState } from '../../../app/state/chartState';
import { CurrentLayoutState } from '../../../app/state/CurrentLayout';
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

interface QueryBuilderComponentProps {
  initialQuery: Query;
  fields: Field[];
  onQueryChange: (query: Query) => void;
}

const initialQuery: Query = {
  combinator: 'and',
  rules: [],
};

const QueryBuilderComponent: React.FC<QueryBuilderComponentProps> = ({ initialQuery, fields, onQueryChange }) => {
  console.log('initialQuery',initialQuery)
  const operatorMappings = {
    date: [
      { name: 'between', label: 'Between' },
      { name: 'before', label: 'Before' },
      { name: 'after', label: 'After' },
      { name: 'on', label: 'On' }
    ],
    text: [
    { name: 'match', label: 'Match' },
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
  const [selectedField, setSelectedField] = useState<string>(initialQuery.index);
  const [ChartField,setChartField] = useState<string>(initialQuery.type);
  const [loading, setLoading] = useState<boolean>(false);
  const [fieldData, setFieldData] = useState<FieldResponse[]>([]);
  const queryRef = useRef<Query>(initialQuery.QuerydslProp);
  const [queryName, setQueryName] = useState<string>(''); // 쿼리 이름 상태 추가
  const [chartInfoMap, setChartInfoMap] = useRecoilState(chartInfoMapState);
  const [queryState, setQueryState] = useState<Query>(initialQuery.QuerydslProp);
  const LayoutMap = useRecoilValue(CurrentLayoutState);

  const { data: savedQueries, refetch: refetchSavedQueries } = useQuery(['loadQueryDsl'], () => loadQueryDsl());

  const queryBuilderRef = useRef(null); // QueryBuilder 인스턴스를 참조하기 위해 useRef 사용

  const [showSavedQueries, setShowSavedQueries] = useState(false); // 쿼리 리스트 

  const allFields: Field[] = [
    { name: 'model', label: 'model', operators: getFeildBYName },
    { name: 'trainingdata', label: 'trainingdata', operators: getFeildBYName }
  ];
  const ChartFields: Field[] = [
    { name: 'honeyComb', label: '벌집', operators: getFeildBYName },
    { name: 'table', label: '테이블', operators: getFeildBYName }
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

  // Elasticsearch 쿼리 포맷터 함수

  const formatElasticsearchQuery = (rule) => {
    const field = rule.field.endsWith('.keyword') ? rule.field : `${rule.field}.keyword`;
  
    switch (rule.operator) {
      case 'match': return { match: { [field]: rule.value } };
      case 'contains':
        return { wildcard: { [field]: `*${rule.value}*` } };
      case 'begins_with':
        return { wildcard: { [field]: `${rule.value}*` } };
      case 'ends_with':
        return { wildcard: { [field]: `*${rule.value}` } };
      case '=':
        return { term: { [field]: rule.value } };
      case '<':
        return { range: { [field]: { lt: rule.value } } };
      case '>':
        return { range: { [field]: { gt: rule.value } } };
      case '!=':
        return { bool: { must_not: { term: { [field]: rule.value } } } };
        case 'between':
          // Ensure rule.value is an array with two elements
          let gteValue, lteValue;
          if (Array.isArray(rule.value)) {
            [gteValue, lteValue] = rule.value;
          } else if (typeof rule.value === 'string') {
            [gteValue, lteValue] = rule.value.split(',').map(v => v.trim());
          }
    
          if (gteValue && lteValue) {
            return {
              range: {
                [rule.field]: {
                  gte: gteValue,
                  lte: lteValue
                }
              }
            };
          } else {
            console.error('Invalid value for between operator:', rule.value);
            return {};
          }
      case 'before':
        return { range: { [rule.field]: { lt: rule.value } } };
      case 'after':
        return { range: { [rule.field]: { gt: rule.value } } };
      case 'on':
        return { term: { [rule.field]: rule.value } };
      default:
        return {};
    }
  };
  const formatElasticsearchGroup = (group) => ({
    bool: {
      [group.combinator === 'and' ? 'must' : 'should']: group.rules.map(rule => 
        rule.rules ? formatElasticsearchGroup(rule) : formatElasticsearchQuery(rule)
      )
    }
  });
  
  const handleQueryChange = useCallback((newQuery: Query) => {
  
    queryRef.current = newQuery;
    const formattedQuery = formatElasticsearchGroup(newQuery);
    console.log("Query changed:", newQuery,formattedQuery);
    setQueryState(newQuery);
    setChartInfoMap((prevChartInfoMap) => ({
      ...prevChartInfoMap,
      ["recentQuery"]: {
        ...prevChartInfoMap[selectedField],
        QuerydslProp: newQuery,
        formattedQuery:formattedQuery,
        index:selectedField,
        type:ChartField,
      },
    }));
  }, [selectedField, setChartInfoMap,ChartField]);

  const handleFieldChange = (event) => {
    const newField = event.target.value;
    setSelectedField(newField);
  };

 const handleChartChange = (event) => {
  const newField = event.target.value;
  setChartField(newField);
 }
  const onClose = () => {
    setIsOpen(false);
  };

  const onSave = async () => {
    const rawQuery = queryRef.current;

    // 필터링 로직 적용
    const formattedQuery = filterQuery(rawQuery)("elasticsearch");
    console.log("Formatted query for saving:", formattedQuery);

    try {
      const queryNameToSave = prompt('Enter the name of the query to save:');
      if (queryNameToSave) {
        const existingQuery = savedQueries.find(q => q.name === queryNameToSave);

        if (existingQuery) {
          const overwrite = confirm('A query with this name already exists. Overwrite it?');
          if (!overwrite) {
            return;
          }
        }

        alert('Query saved successfully');
      } else {
        alert('Saving cancelled: No name provided for the query.');
      }
    } catch (error) {
      console.error('Error during query save process:', error);
      alert('Failed to load or save queries.');
    }

    onClose();
  };

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

  const handleSaveQuery = async () => {
    setShowSavedQueries(!showSavedQueries);

    const rawQuery = queryRef.current;
    const formattedQuery = formatQuery(rawQuery, { format: 'elasticsearch' });
    const queryNameToSave = prompt('Enter the name of the query to save:');
    if (!queryNameToSave) {
      alert('Saving cancelled: No name provided for the query.');
      return;
    }
    const queryDSLParams = {
      name: queryNameToSave,
      queryDsl: formattedQuery,
      QueryBuilderFormat: rawQuery,
    }
    const id = Date.now();
    saveQueryDsl(id, queryDSLParams);
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
        options={[]}
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
      <div>
        <label htmlFor="field-selector">Select chart:</label>
        <select
          id="chart-selector"
          value={ChartField}
          onChange={handleChartChange}
          disabled={loading}
        >
          <option value="">Select a Chart</option>
          {ChartFields.map((field, index) => (
            <option key={index} value={field.name}>{field.label}</option>
          ))}
        </select>
      </div>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <div>
          <QueryBuilder
            ref={queryBuilderRef}
            fields={fieldData}
            query={queryState}
            onQueryChange={handleQueryChange}
            controlElements={{ fieldSelector: memoizedFieldSelector }}
          />
          {showSavedQueries && (
            <SavedQueriesComponent
              savedQueries={savedQueries}
              onSelect={(query) => {
                console.log('Query selected:', query);
                setQueryState(query._source.QueryBuilderFormat);
                const formattedQuery = formatQuery(query._source.QueryBuilderFormat, { format: 'elasticsearch' });

                setChartInfoMap((prevChartInfoMap) => ({
                  ...prevChartInfoMap,
                  ["recentQuery"]: {
                    ...prevChartInfoMap[selectedField],
                    QuerydslProp: query._source.QueryBuilderFormat,
                    formattedQuery:formattedQuery,
                    index: selectedField,
                  },
                }));
              }}
              onDelete={(id) => console.log('Query deleted:', id)}
              onEdit={(query) => console.log('Query edited:', query)}
            />
          )}
        </div>
      )}
      <div style={{ marginTop: '20px' }}>
        <button onClick={handleSaveQuery}>Save Query</button>
        <button onClick={onClose} style={{ marginRight: '10px' }}>Cancel</button>
        <button onClick={() => onRetrieve('elasticsearch')}>Retrieve Elasticsearch Query</button>
      </div>
    </div>
  );
};

export default QueryBuilderComponent;
