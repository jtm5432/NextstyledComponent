// iconsData.ts
import { FaHome, FaUserAlt, FaEnvelope } from 'react-icons/fa';

export interface IconType {
    src: string | React.ComponentType;
    alt: string;
}

export const iconsData: Record<string, IconType> = {
  home: { src: FaHome, alt: 'Home Icon' },
  user: { src: FaUserAlt, alt: 'User Icon' },
  envelope: { src: FaEnvelope, alt: 'Envelope Icon' },
};
