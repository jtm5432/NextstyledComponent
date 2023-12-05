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
 * - selectOptions: { [key: string]: string } - 모달에 셀렉트 인풋에 표시할 옵션
 * - onClose: () => void - 모달을 닫을 때 호출되는 함수
 * - onSave: (data: { [key: string]: string }) => void - 모달에서 변경된 데이터를 저장할 때 호출되는 함수
 * - onChange: (option, target) => void - 모달에서 변경된 데이터를 저장할 때 호출되는 함수
 */
interface DataSelectModalProps {
    data: { [key: string]: string };
    selectOptions: { [key: string]: {} }; // Assuming an array of strings for simplicity
    onClose: () => void;
    onSave: (data: { [key: string]: string }) => void;
    onChange: (option, target) => void;
}
// Type for the options array


const DataSelectModal: React.FC<DataSelectModalProps> = ({ data, onClose, onSave, selectOptions, onChange }) => {

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
    console.log('formDatain', formData, data);
    const [selectedIconName, setSelectedIconName] = useState<string>('home'); // 선택된 아이콘의 이름을 저장
    /**
     * optionsArray는 selectOptions를 배열로 변환한 값입니다.
     */
    const [optionsArray, setOptionsArray] = useState<string[]>([]);

    // Convert selectOptions object to array and set to optionsArray
    /**
     * @param key 
     * @param value 
     */
    const handleInputChange = (key: string, value: string) => {
        setFormData((prev) => ({ ...prev, [key]: value }));
    };


    const handleIconClick = () => {
        setIsIconSelectorOpen(true);
    }
    /**
     * 
     * @param option 선택된 옵션의 이름
     */
    const handleOptionSelect = (option: string) => {
        console.log('chartInfoMap2', formData, 'option', option.split(':')[0])
        const target = data;
        onChange(option.split(':')[0], target);
        //setSelectedValue(option); // 선택된 옵션을 상태 변수에 저장
    };
    const handleIconSelect = (iconData: { src: React.ComponentType | string; keyIndex?: string }) => {
        console.log('handleIconSelecticonData', iconData, 'tt', selectedIconName)
        if (iconData.keyIndex) setSelectedIconName(iconData.keyIndex);
        setIsIconSelectorOpen(false);
    }
    // Save 버튼 클릭 시
    const handleSaveClick = () => {
        // formData에 selectedIconName을 추가
        const updatedFormData = { ...formData, selectedIconName };
        onSave(updatedFormData);
    }
    /**
     * selectOptions가 변경될 때마다 optionsArray를 업데이트합니다.
     */
    useEffect(() => {
        const optionsArr: string[] = Object.entries(selectOptions).map(([key, value]) => {
            console.log('key', key, 'value', value);
            return `${key}: ${(value as { type: string }).type}`;
        });
        setOptionsArray(optionsArr);
    }, [selectOptions]);
    console.log('formData', formData);
    /**
     * formData가 변경될 때마다 useEffect가 호출됩니다.
     */
    useEffect(() => {
        setFormData(data);
    }, [data]);
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
            <DropDown options={optionsArray || []}
                height="400px"
                onOptionSelected={handleOptionSelect} // 선택 처리 함수 전달

            />
            {isIconSelectorOpen && (
                <IconSelector
                    icons={Object.entries(iconsData).map(([, value]) => ({
                        src: typeof value.src === 'string' || value.src.prototype instanceof React.Component ? value.src : value.src,
                        alt: value.alt,
                        keyIndex: value.keyIndex,
                    }))}
                    onIconSelect={handleIconSelect}
                />
            )}

            {/* Form Fields */}
            {Object.entries(formData).map(([key, value]) => {
                // Check if value is an object
                if (value && typeof value === 'object' && !Array.isArray(value)) {
                    return (
                        <div key={key}>
                            <h3>{key}</h3> {/* You can style this header as needed */}
                            {Object.entries(value).map(([innerKey, innerValue]) => (
                                <Label
                                    key={innerKey}
                                    label={innerKey}
                                    value={innerValue as string} // Explicitly type innerValue as string
                                    onChange={(newValue) => handleInputChange(`${key}.${innerKey}`, newValue)}
                                // Using a dot notation string for nested objects
                                />
                            ))}
                        </div>
                    );
                } else {
                    // Render normally for non-object values
                    return (
                        <Label
                            key={key}
                            label={key}
                            value={value}
                            onChange={(newValue) => handleInputChange(key, newValue)}
                        />
                    );
                }
            })}

            {/* Action Buttons */}
            <Button variant="ok" onClick={handleSaveClick}> Save </Button>
            <Button variant="cancel" onClick={onClose}> Close </Button>
        </div>
    );
}

export default DataSelectModal;
