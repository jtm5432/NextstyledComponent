import React, { useEffect, useState } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import Button from '../../atoms/Button';
import DropDown from '../../molecules/DropDown';
import QueryBuilderComponent from '../QueryBuilder';
import { chartInfoMapState } from '../../../app/state/chartState';
import { CurrentLayoutState } from '../../../app/state/CurrentLayout';

interface ChartProperties {
  type: string;
  otherProp: object | string;
  QuerydslProp?: object;
}

interface DataSelectModalProps {
  data: ChartProperties;
  selectOptions: Record<string, ChartProperties>;
  onClose: () => void;
  onSave: (data: ChartProperties) => void;
  onChange: (option: string) => void;
  selectedWidgetKey: number;
}

const DataSelectModal: React.FC<DataSelectModalProps> = ({
  data,
  onClose,
  onSave,
  selectOptions,
  onChange,
  selectedWidgetKey
}) => {
  const [formData, setFormData] = useState(data);
  const [isIconSelectorOpen, setIsIconSelectorOpen] = useState(false);
  const [selectedIconName, setSelectedIconName] = useState<string>('home');
  const [optionsArray, setOptionsArray] = useState<string[]>([]);
  const [isQueryBuilderModalOpen, setIsQueryBuilderModalOpen] = useState<boolean>(false);
  const [chartInfoMap, setChartInfoMap] = useRecoilState(chartInfoMapState);
  const LayoutMap = useRecoilValue(CurrentLayoutState);

  const handleInputChange = (key: string, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleIconSelect = (iconData: { src: React.ComponentType | string; keyIndex?: string }) => {
    if (iconData.keyIndex) setSelectedIconName(iconData.keyIndex);
    setIsIconSelectorOpen(false);
  };

  const handleOptionSelect = (option: string) => {
    onChange(option.split(':')[0]);
  };

  const handleIconClick = () => {
    setIsIconSelectorOpen(true);
  };

  const handleSaveClick = () => {
    const updatedFormData = { ...formData, selectedIconName };
    setChartInfoMap((prevChartInfoMap) => ({
      ...prevChartInfoMap,
      [updatedFormData.type]: updatedFormData,
    }));
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

  const toggleQueryBuilderModal = () => {
    setIsQueryBuilderModalOpen(!isQueryBuilderModalOpen);
  };
  const widget = LayoutMap.lg.find(e => e.i === selectedWidgetKey).ChartInfo;
  console.log('widget',widget,LayoutMap)
  // LayoutMap.lg에서 selectedWidgetKey와 일치하는 항목을 찾습니다.
  const selectedWidget = LayoutMap.lg.find(widget => widget.i === selectedWidgetKey);
  console.log('selectedWidget',selectedWidget)
  return (
    <div>
      <DropDown
        options={optionsArray || []}
        height="400px"
        onOptionSelected={handleOptionSelect}
      />
      <QueryBuilderComponent
        initialQuery={selectedWidget?.ChartInfo || { combinator: 'and', rules: [] }}
        fields={widget?.formState? widget.formState : []}
        onQueryChange={(query) => {
          setFormData(prev => ({ ...prev, QuerydslProp: query }));
        }}
        selectedWidgetKey={selectedWidgetKey}
      />
      <Button variant="primary" onClick={toggleQueryBuilderModal}>쿼리 빌더 열기</Button>
      <Button variant="ok" onClick={handleSaveClick}>Save</Button>
      <Button variant="cancel" onClick={onClose}>Close</Button>
    </div>
  );
};

export default DataSelectModal;
