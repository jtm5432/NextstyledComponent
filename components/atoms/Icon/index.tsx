import React from 'react';

/**
 * Icon 컴포넌트는 아래와 같은 props를 받습니다.
 * - src: React.ComponentType | string - 아이콘의 이미지 또는 컴포넌트
 * - alt: string - 아이콘의 대체 텍스트 및 해당 아이콘의 키값
 */
interface IconProps {
  src: React.ComponentType | string;
  alt?: string;
  keyIndex?: string;
  onClick?: () => void;
  style?: React.CSSProperties; // style 프로퍼티 추가

}

const Icon: React.FC<IconProps> = ({ src, alt, onClick,style }) => {
  const isStringSrc = typeof src === 'string';

  // 문자열인 경우 이미지를 렌더링하고 아닌 경우 컴포넌트를 래핑하여 렌더링합니다.
  const iconContent: React.ReactNode = isStringSrc ? (
    <img src={src as string} alt={alt} />
  ) : (
    React.createElement(src as React.ComponentType, { 'aria-label': alt } as React.Attributes & { 'aria-label': string })
  );

  return (
    <div onClick={onClick} style={{ cursor: 'pointer', ...style }}> {/* style을 병합 */}
      {iconContent}
    </div>
  );
};

export default Icon;
