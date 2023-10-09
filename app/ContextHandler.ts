import { HandleItemClickProps } from '../types/ContextTypes';
import { Menu, Item, useContextMenu, } from 'react-contexify';


export function handleContextMenu(show, event) {
    event.preventDefault();
    show({
        event,
        props: {
            key: 'value'
        }
    });
}

export function handleItemClick(show, setGridLayout, { id, props }: HandleItemClickProps) {
    switch (id) {
        case "add":
            const newGridItem = { i: Date.now().toString(), x: 0, y: 0, w: 1, h: 2 };
            setGridLayout(prevLayout => [...prevLayout, newGridItem]);
            break;
        case "delete":
            if (props && props.gridId) {
                setGridLayout(prevLayout => prevLayout.filter(item => item.i !== props.gridId));
            }
            break;
        // ... 기타 경우 ...
    }
}