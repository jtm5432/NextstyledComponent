/**
 * react-contexify의 타입 정의 파일입니다.
 */

declare module 'react-contexify' {
    import { ReactNode } from 'react';

    interface ContextMenuProps {
        id: string;
        children?: ReactNode;
        // 여기에 필요한 다른 props들도 추가할 수 있습니다.
    }

    interface ItemProps {
        onClick: (event: React.MouseEvent<HTMLDivElement, MouseEvent>, data: any) => void;
        data?: any;
        // 여기에 필요한 다른 props들도 추가할 수 있습니다.
    }
    interface ContextMenuProviderProps {
        children: ReactNode;
        id?: string;
        // 필요한 다른 props들...
    }
    export const ContextMenuProvider: React.FC<ContextMenuProviderProps>;

    export const MenuItem: any;
    export const useContextMenu: any;
    export const ContextMenu: React.FC<ContextMenuProps>;
    export const Item: React.FC<ItemProps>;

    // 다른 컴포넌트나 기능이 있다면 여기에 추가합니다.
}
