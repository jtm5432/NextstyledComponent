import { useState, useEffect } from 'react';
import { useMutation, useQueryClient } from 'react-query';

interface Data {
  timestamp: number;
  [key: string]: any; // 이 부분은 추가적인 데이터 필드를 고려하기 위해 작성되었습니다.
}

const useRecentData = (initialData: Data[] = []): ((newData: Data) => void) => {
  const queryClient = useQueryClient();

  const mutation = useMutation<Data[], Error, Data>(
    (newData: Data) => {
      return new Promise<Data[]>(resolve => {
        // 현재 데이터 가져오기
        const currentData = queryClient.getQueryData<Data[]>('recentData') || [];
  
        // 데이터 추가
        const updatedData = [...currentData, newData];
  
        // 최근 5초 동안의 데이터만 유지
        const fiveSecondsAgo = Date.now() - 5000;
        const filteredData = updatedData.filter((item) => item.timestamp > fiveSecondsAgo);
  
        resolve(filteredData);
      });
    },
    {
      onSuccess: (data: Data[]) => {
        // 데이터를 react-query에 저장
        queryClient.setQueryData('recentData', data);
      },
    }
  );
  

  return mutation.mutate;
};

export default useRecentData;
