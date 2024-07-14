// recoil/atoms.ts
import { atom } from 'recoil';

export const infoBarState = atom({
    key: 'infoBarState',
    default: {
        isOpen: false,
        content: null,
        contentBottom: null,
    },
});
