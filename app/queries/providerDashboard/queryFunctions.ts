// import axios from 'axios';
// import ProviderQueueManager from './ProviderQueueManager';

// const providerName = 'providerDashboard';

// export const fetchData = async (endpoint: string, params?: Record<string, any>) => {
//   const response = await axios.get(endpoint, { params });
//   return response.data;
// };

// export const addQueryToQueue = (endpoint: string, params?: Record<string, any>) => {
//   const task = async () => {
//     try {
//       const data = await fetchData(endpoint, params);
//       console.log('Data fetched:', data);
//       // 여기서 추가로 React Query의 mutation이나 query를 사용하여 데이터를 저장하거나 처리할 수 있습니다.
//     } catch (error) {
//       console.error('Failed to fetch data:', error);
//     }
//   };

//   const queue = ProviderQueueManager.getOrCreateQueue(providerName);
//   queue.enqueue(task);
// };

// export const processQueries = async () => {
//   await ProviderQueueManager.processQueue(providerName);
// };
