import React, { ReactElement } from 'react';
import { FaHome, FaUserAlt, FaEnvelope } from 'react-icons/fa';

interface IconProps {
    src: React.ComponentType  | null;
  alt: string;
  onClick?: () => void;
}

const Icon: React.FC<IconProps> = ({ src, alt, onClick }) => {
  const isStringSrc = typeof src === 'string';

  // 컴포넌트를 대문자로 시작하는 새 변수에 할당
  const SrcComponent = FaHome;

  return (
    <div onClick={onClick} style={{ cursor: 'pointer' }}>
      {isStringSrc ? (
        <img src={src as string} alt={alt} />
      ) : (
        // 대문자로 시작하는 컴포넌트 이름 사용
        <SrcComponent aria-label={alt} />
      )}
    </div>
  );
};

export default Icon;
