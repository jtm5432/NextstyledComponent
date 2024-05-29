import { atom } from 'recoil';

interface LayoutsProps {
  
}

export const CurrentLayoutState = atom<Record<string, LayoutsProps>>({
    key: 'CurrentLayoutState',
  default: {

  },
});
