import React, { useState } from 'react';

interface DropDownProps {
    options: string[];
    height: string; // Prop for setting the height of the dropdown
}

const DropDown: React.FC<DropDownProps> = ({ options, height =300}) => {
    const [selectedOption, setSelectedOption] = useState<string | null>(null);
    const [isOpen, setIsOpen] = useState(false);
    const [filterText, setFilterText] = useState('');

    const toggleDropdown = () => {
        setIsOpen(!isOpen);
    };

    const handleOptionSelect = (option: string) => {
        setSelectedOption(option);
        setIsOpen(false);
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
                <div className="dropdown-menu" style={{ maxHeight: height, overflowY: 'auto' }}>
                    <input
                        type="text"
                        placeholder="Filter options"
                        value={filterText}
                        onChange={handleFilterChange}
                        className="dropdown-filter"
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
