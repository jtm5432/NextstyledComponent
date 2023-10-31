import styled from 'styled-components';


const backgroundImageUrl = '/renders/../GlobeBackground.svg';

const MainContainer = styled.div`
  width: 100%;
  display: flex;
  height: 100vh;
 background-color: #00174A

  // &::before {
  //   content: "";
  //   display: block;
  //   width: 100%;
  //   height: 100%;  /* 원하는 고정 높이 값으로 설정 */
  //   background: url(${backgroundImageUrl}) center/100% 10% no-repeat;
  //   position: absolute;
  //   top: 50%;
  //   left: 50%;
  //   transform: translate(-50%, -50%);
  // }
`;





const WidgetContainer = styled.div`
  width: 100%;
`;

const TitleArea = styled.div`
  height: 90px;

  display: flex;
  justify-content: center;  // 수평 중앙 정렬
  align-items: center;      // 수직 중앙 정렬
  padding: 0 20px;
  text-align: center;

  //폰트에 대한 스타일  
  h2 {  
    margin: 0;
    font-size: 23px;
    font-weight: bold;
    color: #e0e0e0
    
  }
  background: url(${backgroundImageUrl}) center/100% 100% no-repeat;
`;

const Styled = {
  MainContainer,
  WidgetContainer,
  TitleArea
};

export default Styled;
