import React from 'react';
import { StyledLabel , StyledInput } from './Label.styles';
/**
 * LabeledInput 컴포넌트는 아래와 같은 props를 받습니다.
 * - label: string - 라벨에 표시할 텍스트
 * - value: string - input의 value값
 * - onChange?: (value: string) => void - input의 값이 변경될 때 호출되는 함수
 */
interface LabeledInputProps {
  label: string;
  value: string;
  onChange?: (value: string) => void;
}

const LabeledInput: React.FC<LabeledInputProps> = ({ label, value, onChange }) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (onChange) {
            onChange(e.target.value);
        }
    };

    return (
      <div>
        <StyledLabel>{label}</StyledLabel>
        <StyledInput 
          type="text" 
          value={value} 
          onChange={handleChange} 
        />
      </div>
    );
  };
  
  export default LabeledInput;