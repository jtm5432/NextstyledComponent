// import { useState, useEffect } from 'react';
// import socket from './socket';

// const useSocketData = <T>(
//   eventName: string,
//   emitEventName: string,
//   emitPayload: any
// ): { data: T | null, error: any } => {
//   const [data, setData] = useState<T | null>(null);
//   const [error, setError] = useState<any>(null);

//   useEffect(() => {
//     const handleData = (receivedData: T) => {
//       console.log('handleData', receivedData);
//       setData(receivedData);
//     };

//     const handleError = (err: any) => {
//       console.log('handleError', err);
//       setError(err);
//     };
//     socket.on('connect', () => {
//       console.log('socket connected', emitEventName, emitPayload);
//     })
//     socket.on(eventName, handleData);
//       console.log('eventName',eventName)
//       socket.on('error', handleError);
//       socket.on("connect_error", (err) => {
//         console.log(`connect_error due to ${err.message}`);
//       });
//       socket.on('disconnect', (reason) => {
//         console.log('Disconnected: ', reason);
//         // 여기서 reason을 사용하여 연결 끊김의 원인을 추가적으로 처리할 수 있음
//       });
//     // 데이터 요청
//     socket.emit( emitEventName, (response) => {
//       console.log('Response from emit:', response);
//     });

//     // 클린업: 이벤트 리스너 제거
//     return () => {
//       console.log("useSocketData return", eventName,emitPayload ,emitEventName );
//       socket.off(eventName, handleData);
//       socket.off('error', handleError);
//     };
//   }, [eventName, emitEventName, emitPayload]); // 의존성 배열에 추가
//   console.log('useSocketData', emitEventName);
//   return { data, error };
// };

// export default useSocketData;
import { useState, useEffect } from 'react';
import socket from './socket';

const useSocketData = <T>(eventName: string, requestData: any): { data: T | null, error: any } => {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<any>(null);
    socket.emit("me", requestData, (response)=>{
      console.log('emitconnectconnect',response);
  });
  useEffect(() => {
    const handleData = (receivedData: T) => {
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
    


      socket.off(eventName, handleData);
      socket.off('error', handleError);
    };
  }, [eventName]);

  return { data, error };
};

export default useSocketData;