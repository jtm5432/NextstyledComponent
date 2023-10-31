import { useState, useEffect } from 'react';
import socket from './socket';

const useSocketData = <T>(eventName: string): { data: T | null, error: any } => {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<any>(null);

  useEffect(() => {
    const handleData = (receivedData: T) => {
      console.log('handleData')
      setData(receivedData);
    };

    const handleError = (err: any) => {
      console.log('handleError',err)
      setError(err);
    };

    socket.on(eventName, handleData);
    socket.on('error', handleError);
	  socket.on("connect_error", (err) => {
		console.log(`connect_error due to ${err.message}`);
	});
    // 클린업: 이벤트 리스너 제거
    return () => {
	  console.log("useSocketData return", eventName);
	  socket.emit("me", { title: '방화벽 테스트', operator: 'firewall', period: 1, unit: '', ytitle: '항목', yformat: '%' } , (response)=>{
        console.log('emitconnectconnect',response);
    });


      socket.off(eventName, handleData);
      socket.off('error', handleError);
    };
  }, [eventName]);

  return { data, error };
};

export default useSocketData;
