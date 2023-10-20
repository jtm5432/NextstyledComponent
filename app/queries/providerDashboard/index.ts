import QueryQueueManager from './QueryQueueManager';
import { useQuery } from 'react-query';
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
    const endpoint = "https://192.168.10.224:8081/reportdata/";
    const params = {
        operator: "getLineChartDashboard",
        sql: "SELECT ['zhost.keyword'], count(*) AS aa FROM ['zen-{fw*'] WHERE query('@timestamp:[now-1m TO now]') GROUP BY ['zhost.keyword'], date_histogram(field='@timestamp','time_zone'='+9', 'interval'='10s', 'alias'='result')",
        dataCount: 10
    };
  
    const response = await axios.post('/api/axios', { endpoint, params });
    return response.data;
};
const useDashboardLineChart = () => {

    return useQuery(['dashboardLineChart'], () => fetchDashboardLineChart());
}
// const fetchDashboardLineChart = async () => {
//     const searchBody = {
//         query: {
//             bool: {
//                 filter: [
//                     { term: { "zhost.keyword": "" } },
//                     { range: { "@timestamp": { "gte": "now-1h", "lte": "now" } } }
//                 ]
//             }
//         },
//         aggs: {
//             zhost_groups: {
//                 terms: { 
//                     field: "zhost",
//                     size: 10  // 10개의 항목만 가져옴
//                 },
//                 aggs: {
//                     date_histogram_aggs: {
//                         date_histogram: {
//                             field: "@timestamp",
//                             time_zone: "+9",
//                             interval: "10s"
//                         }
//                     }
//                 }
//             }
//         },
//         size: 1000
//     };
//     try {
//         const response = await axios.post('/api/ELASTIC', {
//             index: '*', 
//             body: searchBody
//         });
        
//         return response.data;

//     } catch (error) {
//         console.error("Error fetching line chart data:", error);
//         throw error;
//     }
// };

export { addQueryToQueue, processQueriesInBatches ,useGridData,fetchDashboardLineChart  };

