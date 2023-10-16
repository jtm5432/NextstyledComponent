import React from 'react';
import Icon from '../../atoms/Icon';

interface IconSelectorProps {
    icons: {  src: React.ComponentType | null; alt: string }[];
    onIconSelect: (iconData: { src: React.ComponentType | null; alt: string }) => void;
}
  
  const IconSelector: React.FC<IconSelectorProps> = ({ icons, onIconSelect }) => (
    <div style={{ display: 'flex', gap: '10px' }}>
      {icons.map((icon, index) => (
         <Icon 
          key={index} 
          src={icon.src} 
          alt={icon.alt} 
          onClick={() => onIconSelect(icon)} 
          />
      ))}
    </div>
  );
  
export default IconSelector;
