import React, { useState } from 'react';
import Button from '../../atoms/Button';
import Label from '../../atoms/Labels';
import Icon from '../../atoms/Icon';
import IconSelector from '../../molecules/IconSelector';
import { iconsData } from '../../../app/IconData';

interface ContentModalProps {
    data: { [key: string]: string };
    onClose: () => void;
    onSave: (data: { [key: string]: string }) => void;
}

const ContentModal: React.FC<ContentModalProps> = ({ data, onClose, onSave }) => {
    const [formData, setFormData] = useState(data);
    const [isIconSelectorOpen, setIsIconSelectorOpen] = useState(false);
    const [selectedIconSrc, setSelectedIconSrc] = useState<React.ComponentType | null>(null);

    const handleInputChange = (key: string, value: string) => {
        setFormData(prev => ({ ...prev, [key]: value }));
    }

    const handleIconClick = () => {
        setIsIconSelectorOpen(true);
    }

    const handleIconSelect = (iconData: { src: React.ComponentType | null; alt: string }) => {
        setSelectedIconSrc(iconData.src);
        setIsIconSelectorOpen(false);
    }

    return (
        <div>
            {/* Render selected icon or default icon */}
            {selectedIconSrc ? React.createElement(selectedIconSrc) : React.createElement(iconsData.home.src)}
            <Icon
                src={selectedIconSrc || iconsData.home.src}
                alt="selected-icon"
                onClick={handleIconClick}
            />

            {/* Icon Selector Modal */}
            {isIconSelectorOpen && (
                <IconSelector
                    icons={Object.entries(iconsData).map(([key, value]) => ({
                        src: typeof value.src === 'string' ? value.src : "Some default or generated src",
                        alt: value.alt,
                    }))}
                    onIconSelect={handleIconSelect}
                />
            )}

            {/* Form Fields */}
            {Object.entries(formData).map(([key, value]) => (
                <Label
                    key={key}
                    label={key}
                    value={value}
                    onChange={(newValue) => handleInputChange(key, newValue)}
                />
            ))}

            {/* Action Buttons */}
            <Button variant="ok" onClick={() => onSave(formData)}> Save </Button>
            <Button variant="cancel" onClick={onClose}> Close </Button>
        </div>
    );
}

export default ContentModal;
