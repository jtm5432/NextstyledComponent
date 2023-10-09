import styled from 'styled-components';

const Menu = styled.div`
  position: absolute;
  z-index: 1000;
  background-color: #ffffff;
  border: 1px solid #ccc;
  box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.3);
`;

const MenuItem = styled.div`
  padding: 8px 12px;
  cursor: pointer;
  &:hover {
    background-color: #f7f7f7;
  }
`;


const Styled = {
    Menu,
    MenuItem,
    
  };
  
  export default Styled;
  