export type LayoutItemType = {
    i: string;
    x: number;
    y: number;
    w: number;
    h: number;
};
export type LayoutType = { 
    lg?: LayoutItemType[],
    md?: LayoutItemType[],
    sm?: LayoutItemType[],
    xs?: LayoutItemType[],
    xxs?: LayoutItemType[]
};
type SetGridLayout = React.Dispatch<React.SetStateAction<LayoutItemType[]>>;

export interface LayoutsProps {
    layouts: LayoutType;
    setGridLayout: SetGridLayout;
    
}

