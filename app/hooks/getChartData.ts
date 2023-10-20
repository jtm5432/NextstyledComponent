// import { useQuery } from 'react-query';

// const useDashboardLineChart = (fetchDashboardLineChart) => {
//   return useQuery('dashboardLineChart', fetchDashboardLineChart, {
//     onSuccess: (data) => {
//       // 여기에서 data를 바탕으로 원하는 작업을 수행
//       console.log("Data fetch was successful!", data);
//     },
//     onError: (error) => {
//       console.error("There was an error fetching the data", error);
//     },
//     onSettled: (data, error) => {
//       // 이 콜백은 쿼리가 성공하든 실패하든 호출됩니다.
//       console.log("Query has settled");
//     }
//   });
// };