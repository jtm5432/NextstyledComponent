import React from 'react';
import { ColorIcon } from './Legends.styels';

interface LegendItemProps {
    label: string;
    color: string;
}

const LegendItem: React.FC<LegendItemProps> = ({ label, color }) => {
    return (
        <div className="legend-item">
            <ColorIcon color={color} />
            <span>{label}</span>
        </div>
    );
};

export default LegendItem;
