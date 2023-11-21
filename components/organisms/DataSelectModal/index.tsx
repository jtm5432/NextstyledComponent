import React, { useEffect, useState } from 'react';
import Button from '../../atoms/Button';
import Label from '../../atoms/Labels';
import Icon from '../../atoms/Icon';
import IconSelector from '../../molecules/IconSelector';
import { iconsData } from '../../../app/IconData';
import { useQuery } from 'react-query';
import { getIndexlist } from '../../../app/queries/providerDashboard';
import DropDown from '../../molecules/DropDown';

/**
 * DataSelectModal 컴포넌트는 아래와 같은 props를 받습니다.
 * - data: { [key: string]: string } - 모달에 표시할 데이터
 * - onClose: () => void - 모달을 닫을 때 호출되는 함수
 * - onSave: (data: { [key: string]: string }) => void - 모달에서 변경된 데이터를 저장할 때 호출되는 함수
 */
interface DataSelectModalProps {
    data: { [key: string]: string };
    selectOptions: string[]; // Assuming an array of strings for simplicity
    onClose: () => void;
    onSave: (data: { [key: string]: string }) => void;
}

const DataSelectModal: React.FC<DataSelectModalProps> = ({ data, onClose, onSave }) => {
    const [formData, setFormData] = useState(data);
    const [isIconSelectorOpen, setIsIconSelectorOpen] = useState(false);
    const { data: selectIndexList, isLoading, refetch } = useQuery<Array<any>>(
        'getIndexlistquery',
        getIndexlist,
        {
            refetchInterval: 5000, // refetch the data every 5 seconds
            onSuccess: (rawData: Array<any>) => {
                console.log('getIndexlist', rawData);
            },
        }
    );
    const [selectedIconName, setSelectedIconName] = useState<string>('home'); // 선택된 아이콘의 이름을 저장

    const handleInputChange = (key: string, value: string) => {
        setFormData((prev) => ({ ...prev, [key]: value }));
    };


    const handleIconClick = () => {
        setIsIconSelectorOpen(true);
    }

    const handleIconSelect = (iconData: { src: React.ComponentType | string; keyIndex?: string }) => {
        console.log('handleIconSelecticonData', iconData, 'tt', selectedIconName)
        if(iconData.keyIndex)setSelectedIconName(iconData.keyIndex);
        setIsIconSelectorOpen(false);
    }
    // Save 버튼 클릭 시
    const handleSaveClick = () => {
        // formData에 selectedIconName을 추가
        const updatedFormData = { ...formData, selectedIconName };
        onSave(updatedFormData);
    }

    useEffect(() => {
        
    },[selectIndexList]);
    return (
        <div>
            <Icon
                src={iconsData[selectedIconName].src}
                alt="selected-icon"
                onClick={handleIconClick}
            />
            <DropDown options={selectIndexList || []} 
                    height="400px"
            />
            {isIconSelectorOpen && (
                <IconSelector
                    icons={Object.entries(iconsData).map(([, value]) => ({
                        src: typeof value.src === 'string' || value.src.prototype instanceof React.Component ? value.src : value.src,
                        alt: value.alt,
                        keyIndex:value.keyIndex,
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
            <Button variant="ok" onClick={handleSaveClick}> Save </Button>
            <Button variant="cancel" onClick={onClose}> Close </Button>
        </div>
    );
}

export default DataSelectModal;
