
import styled from 'styled-components';


interface LabeledInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
}

export const StyledLabel = styled.label`
  display: block;
  color: #4a5568; /* text-gray-700 */
  font-size: 0.875rem; /* text-sm */
  font-weight: 700; /* font-bold */
  margin-bottom: 0.5rem; /* mb-2 */
`;

export const StyledInput = styled.input`
  box-shadow: none;
  appearance: none;
  border: 1px solid #d1d5db; /* gray */
  border-radius: 0.25rem; /* rounded */
  width: 100%;
  padding: 0.5rem 0.75rem; /* py-2 px-3 */
  font-size: 0.875rem; /* text-sm */
  color: #4a5568; /* text-gray-700 */
  line-height: 1.25rem; /* leading-tight */

  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px rgba(66, 153, 225, 0.5); /* shadow-outline and focus ring color */
  }
`;

