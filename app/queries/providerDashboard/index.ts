import QueryQueueManager from './QueryQueueManager';
import { useQuery } from 'react-query';
import {SaveData} from '../../../types/dashboardTypes';

import axios from 'axios';
const PROVIDER_NAME = 'providerDashboard';

const addQueryToQueue = (endpoint: string, params?: Record<string, any>) => {
    
    return new Promise((resolve, reject) => {
        const task = async () => {
            try {
                const response = await axios.get(endpoint, { params });
                resolve(response); // 큐에서 작업이 완료되면 프로미스를 resolve 합니다.
            } catch (error) {
                reject(error); // 에러가 발생하면 프로미스를 reject 합니다.
            }
        };

        QueryQueueManager.enqueue(PROVIDER_NAME, endpoint, task);
    });
};

const processQueriesInBatches = () => {
    QueryQueueManager.processInBatches(PROVIDER_NAME, 3);
};

const fetchGridData = async (gridId) => {
    const endpoint = `/api/axios/data?grid=${gridId}`;
    return addQueryToQueue(endpoint, { grid: gridId });
};

const useGridData = (gridId: string) => {
    return useQuery(['gridData', gridId], () => fetchGridData(gridId));
};

//  const executeQueries = () => {
//     processQueriesInBatches();
// };
const fetchDashboardLineChart = async () => {
    const endpoint = "https://localhost:8081/reportdata";
    const params = {
        operator: "getLineChartDashboard",
        sql: `SELECT ['zhost.keyword'], count(*) AS aa FROM ['c00000-zen-{fw*'] WHERE query('@timestamp:[now-5h TO now]') GROUP BY ['zhost.keyword'], date_histogram(field='@timestamp','time_zone'='+9', 'interval'='10s', 'alias'='result')`,
        dataCount: 5
    };
  
    // const response = await axios.get(endpoint, { 
    //     params,
    //   //  httpsAgent: agent 
    // });
    const response = await axios.post('/api/axios', { endpoint, params });
       console.log('response.data',response)
       if (response.status === 200) {
        return response.data;
      } else {
        throw new Error("Failed to fetch data");
      }
};
function buildOpenSearchQuery({ 
  startTime, 
  endTime, 
  actionField, 
  actionValue, 
  aggField, 
  aggType, 
  aggFieldName 
}) {
  // Basic query structure
  const query = {
    size: 0,
    query: {
      bool: {
        filter: [
          { range: { "@timestamp": { gte: startTime, lte: endTime } } },
          { term: { [actionField]: actionValue } }
        ]
      }
    },
    aggs: {}
  };

  // Adding dynamic aggregation
  query.aggs[aggField] = {
    [aggType]: { field: aggFieldName }
  };

  return query;
}
const getIndexlist = async () => {
  const endpoint = "https://localhost:8081/reportdata";
  const params = {
    operator: "getIndices",
    cid: "c0000*"
  };
  const response = await axios.post('/api/axios', { endpoint, params });
 // console.log('getIndexlistresponse.data', response);

  if (response.status === 200) {
    const data = response.data;
    const dataArray = data.split(' ');
    console.log('dataArray', dataArray);
    return dataArray;
  } else {
    throw new Error("Failed to fetch data");
  }
};


const fetchDashboardBarcolChart = async () => {
    const endpoint = "https://localhost:8081/reportdata";
    const params = {
      operator: "getBarColChartDashboard",
      sql: "SELECT ['firewall.dst.keyword'], avg(facility) AS aa FROM ['zen-{fw*'] WHERE query('(@timestamp:[now-2m TO now]) AND (firewall.action: drop)') GROUP BY ['firewall.dst.keyword'] LIMIT 10"
      ,cid : "c10000"
    };
  
    // const response = await axios.get(endpoint, { 
    //     params,
    //     //httpsAgent: agent 
    // });
    const response = await axios.post('/api/axios', { endpoint, params });
    console.log('response.data',response)
    if (response.status === 200) {
      return JSON.stringify(response.data);
    } else {
      throw new Error("Failed to fetch data");
    }
  };
const SavegridLayouts = async ({
  id,
  gridLayout,
}: {
  id: string;
  gridLayout: {
    i: string;
    x: number;
    y: number;
    w: number;
    h: number;
  }[];
}) => {
   const endpoint = "https://localhost:8081/reportdata";
    // params 정의
    const params = {
      operator: "modifyDoc",
      index:"nextdashboard",
      id: id,
      gridLayout: gridLayout
    };
  
    const response = await axios.post('/api/axios', { endpoint, params });
       console.log('response.dataSavegridLayouts',response)
    if (response.status === 200) {
      return JSON.stringify(response.data);
    } else {
      throw new Error("Failed to fetch data");
    }


}
const fetchSavedData = async (id) => {

  console.log('fetchSavedData',id)
  const endpoint = "https://localhost:8081/reportdata";
  const params = {
    operator: "searchDoc",
    index:"nextdashboard",
    
  };
  //if(id)params['id'] = id;

  const response = await axios.post('/api/axios', { endpoint, params });
  console.log('response.datafetchSavedData',response)
  return response.data.results;
}

const saveDataToLocalStorage = async (data: SaveData): Promise<SaveData> => {
  //localStorage.setItem('data', JSON.stringify(data));
  
  const endpoint = "https://localhost:8081/reportdata";
  const params = {
    operator: "modifyDoc",
    param : data,
  };


    return data; // 저장된 데이터 반환
};

const fetchSearchData = async (searchParams) => {
  const response = await axios.post('/api/axios', searchParams);

  if (response.status !== 200) {
    throw new Error('Failed to fetch data');
  }

  return response.data;
};

export { fetchSearchData ,SavegridLayouts,addQueryToQueue,fetchSavedData, processQueriesInBatches ,useGridData,fetchDashboardLineChart,fetchDashboardBarcolChart ,getIndexlist ,saveDataToLocalStorage};

