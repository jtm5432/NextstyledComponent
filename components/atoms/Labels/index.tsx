import React from 'react';
import { StyledLabel , StyledInput } from './Label.styles';

interface LabeledInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
}

const LabeledInput: React.FC<LabeledInputProps> = ({ label, value, onChange }) => {
    return (
      <div>
        <StyledLabel>{label}</StyledLabel>
        <StyledInput 
          type="text" 
          value={value} 
          onChange={e => onChange(e.target.value)} 
        />
      </div>
    );
  };
  
  export default LabeledInput;