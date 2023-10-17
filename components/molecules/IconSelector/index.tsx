import React from 'react';
import Icon from '../../atoms/Icon';
import { v4 as uuidv4 } from 'uuid'; // uuid 라이브러리를 가져옵니다.

/**
 * IconSelector 컴포넌트는 아래와 같은 props를 받습니다.
 * - icons: { src: React.ComponentType | string; alt: string }[] - 아이콘 목록
 * - onIconSelect: (iconData: { src: React.ComponentType | string; alt: string }) => void - 아이콘을 선택했을 때 호출되는 함수
 * 
 */
interface IconSelectorProps {
    icons: {  src: React.ComponentType | string; alt?: string; keyIndex?:string }[];
    onIconSelect: (iconData: { src: React.ComponentType | string; alt?: string; keyIndex?:string}) => void;
}
  
  const IconSelector: React.FC<IconSelectorProps> = ({ icons, onIconSelect }) =>{ 
    //console.log('icons',icons); 
    
    return (
    <div style={{ display: 'flex', gap: '10px' }}>
      {icons.map((icon, index) => {
        console.log('renderIcon',icon,index)
        
        return (
         <Icon 
          key={uuidv4()} // UUID를 사용하여 고유한 키 값을 생성합니다.
          src={icon.src} 
          alt={icon.alt}
          keyIndex={icon.keyIndex}
          onClick={() => onIconSelect(icon)} 
          />
      )})}
    </div>
  )};
  
export default IconSelector;
