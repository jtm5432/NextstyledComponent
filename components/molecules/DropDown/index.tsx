import React, { useState } from 'react';

interface DropDownProps {
    options: string[];
    height?: string;
    onOptionSelected?: (selectedOption: string) => void; // 콜백 함수 추가
}

const DropDown: React.FC<DropDownProps> = ({ options, onOptionSelected }) => {
    const [selectedOption, setSelectedOption] = useState<string | null>(null);
    const [isOpen, setIsOpen] = useState(false);
    const [filterText, setFilterText] = useState('');

    const toggleDropdown = () => {
        setIsOpen(!isOpen);
    };

    const handleOptionSelect = (option: string) => {
        setSelectedOption(option);
        setIsOpen(false);
        if(onOptionSelected)onOptionSelected(option); // 콜백 함수 실행
    };

    const handleFilterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setFilterText(event.target.value);
    };

    const filteredOptions = options.filter(option =>
        option.toLowerCase().includes(filterText.toLowerCase())
    );

    return (
        <div className="dropdown">
            <button className="dropdown-toggle" onClick={toggleDropdown}>
                {selectedOption || 'Select an option'}
            </button>
            {isOpen && (
                <div className="dropdown-menu">
                    <input
                        type="text"
                        placeholder="Filter options"
                        value={filterText}
                        onChange={handleFilterChange}
                    />
                    <ul className="dropdown-options">
                        {filteredOptions.map((option) => (
                            <li
                                key={option}
                                className="dropdown-option"
                                onClick={() => handleOptionSelect(option)}
                            >
                                {option}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default DropDown;
