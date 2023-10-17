// iconsData.ts
import { FaHome, FaUserAlt, FaEnvelope,FaGlobeAfrica } from 'react-icons/fa';

export interface IconType {
    src: string | React.ComponentType;
    alt?: string;
    keyIndex ? : string;
}

export const iconsData: Record<string, IconType> = {
  home: { src: FaHome, alt: 'home',keyIndex : 'home' },
  user: { src: FaUserAlt, alt: 'user' ,keyIndex : 'user'},
  envelope: { src: FaEnvelope, alt: 'envelope' ,keyIndex : 'envelope'},
  FaGlobeAfrica: {src :FaGlobeAfrica, alt: 'FaGlobeAfrica',keyIndex : 'FaGlobeAfrica'},
};
