import React from 'react';
import LegendItem  from '../../molecules/LegendItem';
import { useTheme } from 'styled-components';

/**
 * @description 레전드 컴포넌트
 * @param {DataSet[]} datasets 레전드에 표시할 데이터셋
 * @example
 * <Legend datasets={[
 *  { label: '서울', value: 100 },
 * { label: '경기', value: 200 },
 * { label: '인천', value: 300 },
 * { label: '강원', value: 400 },
 * { label: '충북', value: 500 },
 * { label: '충남', value: 600 },
 * { label: '전북', value: 700 },
 * { label: '전남', value: 800 },
 * { label: '경북', value: 900 },
 * { label: '경남', value: 1000 },
 * { label: '제주', value: 1100 },
 * ]} />
 * 
 */
interface DataSet {
    label: string;
    value: number;
}

interface LegendProps {
    datasets: DataSet[] | null;
}


const Legend: React.FC<LegendProps> = ({datasets }) => {
    if(!datasets) return null;
    const sortedDatasets = [...datasets].sort((a, b) => b.value - a.value);
    const theme = useTheme();

    return (
        <div className="chart-legend">
            {sortedDatasets.map((dataset, index) => (
                <LegendItem 
                    key={index}
                    label={dataset.label}
                    color={theme.ColorsetArray[index % theme.ColorsetArray.length]}
                />
            ))}
        </div>
    );
};

export default Legend;