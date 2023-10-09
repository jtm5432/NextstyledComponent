import React, { useState } from 'react';

interface ContentModalProps {
    data: { [key: string]: string }; // 객체 형태로 데이터를 받습니다.
    onClose: () => void;
    onSave: (data: { [key: string]: string }) => void; // 수정된 데이터를 반환하는 onSave 콜백 함수를 추가합니다.
}

const ContentModal: React.FC<ContentModalProps> = ({ data, onClose, onSave }) => {
    const [formData, setFormData] = useState(data);

    const handleInputChange = (key: string, value: string) => {
        setFormData(prev => ({ ...prev, [key]: value }));
    }

    return (
        <div>
            {Object.entries(formData).map(([key, value]) => (
                <div key={key}>
                    <label className="block text-gray-700 text-sm font-bold mb-2">
                        {key}
                        <input
                            type="text"
                            value={value}
                            onChange={e => handleInputChange(key, e.target.value)}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        />
                    </label>
                </div>
            ))}
            <button
                className="mt-4 px-4 py-2 bg-blue-500 text-white rounded mr-4"
                onClick={() => onSave(formData)}
            >
                Save
            </button>
            <button className="mt-4 px-4 py-2 bg-red-500 text-white rounded" onClick={onClose}>
                Close
            </button>
        </div>
    );
}

export default ContentModal;
