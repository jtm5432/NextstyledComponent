import { stringify } from 'querystring';
import { HandleItemClickProps } from '../types/ContextTypes';
import { Menu, Item, useContextMenu, } from 'react-contexify';

export function handleContextMenu(show, event, setIsWidgetClicked) {
    event.preventDefault();

    // event.target에서 상위 div까지 올라가며 id를 찾음
    let currentElement = event.target;
    let targetId = null;

    while (currentElement) {
        if (currentElement.id) {
            targetId = currentElement.id;
            break;
        }
        currentElement = currentElement.parentElement;
    }
    console.log('currentElement', currentElement,targetId);
    const isWidget = event.target.classList.value.includes('Widget-sc');
    
    if (isWidget) {
      setIsWidgetClicked(true);
    } else {
      setIsWidgetClicked(false);
    }
    
    show({
        event,
        props: {
            gridId: targetId // targetId를 props로 전달
        }
    });
}


export function handleItemClick(show, setGridLayout, { id, props }: HandleItemClickProps) {
   
   // console.log('id', id, 'props', props ,props.props.gridId);
    switch (id) {
        case "add":
            const newGridItem = { i: Date.now().toString(), x: 0, y: 0, w: 1, h: 2 };
            setGridLayout(prevLayout => [...prevLayout, newGridItem]);
            break;
        case "delete":
            if (props &&props.props&&props.props.gridId) { // props.targetId를 사용
             
                setGridLayout(prevLayout => prevLayout.filter(item => item.i !== props.props.gridId));
            }
            break;
        // ... 기타 경우 ...
    }
}