import axios from 'axios';
import { useQuery } from 'react-query';

type FetchParams = {
  operator: string;
  sql: string;
  dataCount: number;
};

const fetchReportData = async ({ operator, sql, dataCount }: FetchParams) => {
  const baseURL = 'https://192.168.10.224/reportdata/';
  const response = await axios.get(baseURL, {
    params: {
      operator,
      sql,
      dataCount,
    },
  });

  return response.data;
};

export const useReportData = (params: FetchParams) => {
  return useQuery(['reportData', params], () => fetchReportData(params));
};
