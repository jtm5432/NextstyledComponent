import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useQuery } from 'react-query';
import axios from 'axios';

const Container = styled.div`
  width: 100%;
  height: calc(100% - 33px);
`;

const LoadingIndicator = styled.div`
  position: absolute;
  left: 50%;
  top: 30%;
  transform: translateX(-50%);
  display: ${({ isLoading }) => (isLoading ? 'block' : 'none')};
`;

function RealtimeChart({ id }) {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = async () => {
    const response = await axios.get('/api/data');
    return response.data;
  };

  const { data: apiData, status } = useQuery('chartData', fetchData, {
    onSuccess: () => setIsLoading(false),
  });

  useEffect(() => {
    if (status === 'success') {
      setData(apiData);
    }
  }, [status, apiData]);

  return (
    <Container id={`${id}component`}>
      <LoadingIndicator isLoading={isLoading} id={`${id}loadingbar`} />
      {/* 차트를 렌더링하는 로직 */}
    </Container>
  );
}

export default RealtimeChart;
