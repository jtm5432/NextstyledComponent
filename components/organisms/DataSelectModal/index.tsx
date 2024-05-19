import React, { useEffect, useState } from 'react';
import Button from '../../atoms/Button';
import Label from '../../atoms/Labels';
import Icon from '../../atoms/Icon';
import IconSelector from '../../molecules/IconSelector';
import { iconsData } from '../../../app/IconData';
import { useQuery } from 'react-query';
import { getIndexlist , getFeildBYName } from '../../../app/queries/providerDashboard';
import DropDown from '../../molecules/DropDown';
// import QueryModal from '../QueryBuilderModal';
import { RuleGroupType } from 'react-querybuilder';
import QueryBuilderComponent from '../QueryBuilder';

interface DataSelectModalProps {
  data: { [key: string]: string };
  selectOptions: { [key: string]: {} };
  onClose: () => void;
  onSave: (data: { [key: string]: string }) => void;
  onChange: (option: string, target: any) => void;
}

const DataSelectModal: React.FC<DataSelectModalProps> = ({ data, onClose, onSave, selectOptions, onChange }) => {
  const [formData, setFormData] = useState(data);
  const [isIconSelectorOpen, setIsIconSelectorOpen] = useState(false);
  const [selectedIconName, setSelectedIconName] = useState<string>('home');
  const [optionsArray, setOptionsArray] = useState<string[]>([]);
  const [isQueryBuilderModalOpen, setIsQueryBuilderModalOpen] = useState<boolean>(false);
  const [currentQueryBuilderQuery, setCurrentQueryBuilderQuery] = useState<RuleGroupType | null>(null);

  const handleInputChange = (key: string, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleIconSelect = (iconData: { src: React.ComponentType | string; keyIndex?: string }) => {
    if (iconData.keyIndex) setSelectedIconName(iconData.keyIndex);
    setIsIconSelectorOpen(false);
  };

  const handleOptionSelect = (option: string) => {
    onChange(option.split(':')[0], data);
  };

  const handleIconClick = () => {
    setIsIconSelectorOpen(true);
  };

  const handleSaveClick = () => {
    const updatedFormData = { ...formData, selectedIconName };
    onSave(updatedFormData);
  };

  useEffect(() => {
    const optionsArr: string[] = Object.entries(selectOptions).map(([key, value]) => `${key}: ${(value as { type: string }).type}`);
    setOptionsArray(optionsArr);
  }, [selectOptions]);

  useEffect(() => {
    setFormData(data);
    console.log('setFormData', data);
    
  }, [data]);

  // QueryBuilderModal로 전환하는 로직
  const toggleQueryBuilderModal = () => {
    setIsQueryBuilderModalOpen(!isQueryBuilderModalOpen);
  };

  // if (isQueryBuilderModalOpen) {
  //   return (
  //     <QueryBuilder/>
  //   );
  // }

  return (
    <div>
      <Icon
        src={iconsData[selectedIconName]?.src || ''}
        alt="selected-icon"
        onClick={handleIconClick}
      />
      <DropDown
        options={optionsArray || []}
        height="400px"
        onOptionSelected={handleOptionSelect}
      />
{/*       
      {isIconSelectorOpen && (
        <IconSelector
          icons={Object.entries(iconsData).map(([key, value]) => ({
            src: typeof value.src === 'string' || value.src.prototype instanceof React.Component ? value.src : 'unknown',
            alt: value.alt,
            keyIndex: value.keyIndex,
          }))}
          onIconSelect={handleIconSelect}
        />
      )}
      {formData&&Object.entries(formData).map(([key, value]) => (
        <Label
          key={key}
          label={key}
          value={typeof value === 'object' ? '' : value}
          onChange={(newValue) => handleInputChange(key, newValue)}
        />
      ))} */}

      <QueryBuilderComponent initialQuery={[]} fields={[]}/>
      <Button variant="primary" onClick={toggleQueryBuilderModal}>쿼리 빌더 열기</Button>
      <Button variant="ok" onClick={handleSaveClick}>Save</Button>
      <Button variant="cancel" onClick={onClose}>Close</Button>
    </div>
  );
};

export default DataSelectModal;