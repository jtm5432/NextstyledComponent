import React, { useState, FormEvent } from 'react';

// Define the shape of the configOptions prop
interface ConfigOptions {
    [key: string]: any[]; // Assuming each config option is an array of values
}

// Define the props for the ConfigButton component
interface ConfigButtonProps {
    configOptions: ConfigOptions;
    onConfigSubmit: (configData: { [key: string]: string }) => void;
}

const ConfigButton: React.FC<ConfigButtonProps> = ({ configOptions, onConfigSubmit }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const configData = Object.fromEntries(formData.entries()) as { [key: string]: string };
        onConfigSubmit(configData);
        setIsModalOpen(false);
    };

    const renderFormElements = () => {
        return Object.entries(configOptions).map(([key, values]) => {
            if (Array.isArray(values)) {
                return (
                    <label key={key}>
                        {key}:
                        <select name={key}>
                            {values.map(value => <option key={value.toString()} value={value.toString()}>{value}</option>)}
                        </select>
                    </label>
                );
            }
            // Add other types of form elements as needed
        });
    };

    return (
        <>
            <button onClick={() => setIsModalOpen(true)}>Configure Chart</button>
            {isModalOpen && (
                <div className="config-modal">
                    <form onSubmit={handleSubmit}>
                        {renderFormElements()}
                        <button type="submit">Apply</button>
                        <button type="button" onClick={() => setIsModalOpen(false)}>Cancel</button>
                    </form>
                </div>
            )}
        </>
    );
};

export default ConfigButton;
