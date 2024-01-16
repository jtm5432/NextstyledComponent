import { useState, useEffect } from 'react';
import socket from './socket';

const useSocketData = <T>(
  eventName: string,
  emitEventName: string,
  emitPayload: any
): { data: T | null, error: any } => {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<any>(null);

  useEffect(() => {
    const handleData = (receivedData: T) => {
      setData(receivedData);
    };

    const handleError = (err: any) => {
      console.log('handleError', err);
      setError(err);
    };
    socket.on('connect', () => {
      console.log('socket connected', emitEventName, emitPayload);
    })
    socket.on(eventName, handleData);
      console.log('eventName',eventName)
      socket.on('error', handleError);
      socket.on("connect_error", (err) => {
        console.log(`connect_error due to ${err.message}`);
      });

    // 데이터 요청
    socket.emit( emitEventName, (response) => {
      console.log('Response from emit:', response);
    });

    // 클린업: 이벤트 리스너 제거
    return () => {
      console.log("useSocketData return", eventName,emitPayload ,emitEventName );
      socket.off(eventName, handleData);
      socket.off('error', handleError);
    };
  }, [eventName, emitEventName, emitPayload]); // 의존성 배열에 추가
  console.log('useSocketData', emitEventName);
  return { data, error };
};

export default useSocketData;
