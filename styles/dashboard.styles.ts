import styled from 'styled-components';


const backgroundImageUrl = '/GlobeBackground.svg';

const MainContainer = styled.div`
  display: flex;
  height: 100vh;
  background: url(${backgroundImageUrl}) center/cover; /* 배경 이미지 설정 */
`;



const WidgetContainer = styled.div`
  width: 100%;
  background-color: #e0e0e0;
`;

const TitleArea = styled.div`
  height: 90px;
 
  display: flex;
  align-items: center;
  padding: 0 20px;
  h2 {
    margin: 0;
  }
`;

const Styled = {
  MainContainer,
  WidgetContainer,
  TitleArea
};

export default Styled;
