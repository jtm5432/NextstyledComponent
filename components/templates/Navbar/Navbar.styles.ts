import styled from 'styled-components';

interface NavbarProps {
  key: string;
}

const Navbar = styled.div<NavbarProps>`
  width: ${({ key }) => (key ==='true'? '30px' : 'auto')};
  min-width: 30px;
  padding: 5px;
  overflow: hidden;
  background-color: #f4f4f4;

`;

const NavbarItem = styled.div`
display: flex;
align-items: center;
height: 40px;
border: 1px solid #f4f4f4;
&:hover {
  background-color: #eee; /* 마우스 호버 시 변경할 배경색 */
  border: 1px solid #ccc; /* 마우스 호버 시 변경할 테두리 스타일 */
  /* 필요한 스타일을 추가하세요 */
}
`;
const Styled = {
    Navbar,
    NavbarItem ,
    
  };
  
  export default Styled;
  