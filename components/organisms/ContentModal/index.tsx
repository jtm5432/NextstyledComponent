import React, { useState } from 'react';
import Button from '../../atoms/Button';
import Label from '../../atoms/Labels';
import Icon from '../../atoms/Icon';
import IconSelector from '../../molecules/IconSelector';
import { iconsData } from '../../../app/IconData';
/**
 * ContentModal 컴포넌트는 아래와 같은 props를 받습니다.
 * - data: { [key: string]: string } - 모달에 표시할 데이터
 * - onClose: () => void - 모달을 닫을 때 호출되는 함수
 * - onSave: (data: { [key: string]: string }) => void - 모달에서 변경된 데이터를 저장할 때 호출되는 함수
 */
interface ContentModalProps {
    data: { [key: string]: string };
    onClose: () => void;
    onSave: (data: { [key: string]: string }) => void;
}

const ContentModal: React.FC<ContentModalProps> = ({ data, onClose, onSave }) => {
    const [formData, setFormData] = useState(data || {}); // null이나 undefined인 경우 빈 객체로 초기화
    const [isIconSelectorOpen, setIsIconSelectorOpen] = useState(false);
    const [selectedIconName, setSelectedIconName] = useState<string>('home'); // 선택된 아이콘의 이름을 저장
    //console.log('iconsData', iconsData)
    const handleInputChange = (key: string, value: string) => {
        setFormData(prev => ({ ...prev, [key]: value }));
    }

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


    return (
        <div>
            <Icon
                src={iconsData[selectedIconName].src}
                alt="selected-icon"
                onClick={handleIconClick}
            />
            {isIconSelectorOpen && (
                <IconSelector
                    icons={Object.entries(iconsData).map(([key, value]) => ({
                        src: typeof value.src === 'string' || value.src.prototype instanceof React.Component ? value.src : value.src,
                        alt: value.alt,
                        keyIndex:value.keyIndex,
                    }))}
                    onIconSelect={handleIconSelect}
                />
            )}

            {/* Form Fields */}
            {formData && Object.entries(formData).map(([key, value]) => (
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

export default ContentModal;
