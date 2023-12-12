export interface SaveData {
    title: string;
    description: string;
    selectedIconName?: string;
    gridLayout: string;
  }

  export interface GridLayout {
    i: string;  // 아이템의 고유 식별자
    x: number;  // 그리드 내의 x 위치 (보통 열 번호)
    y: number;  // 그리드 내의 y 위치 (보통 행 번호)
    w: number;  // 아이템의 너비
    h: number;  // 아이템의 높이
  }
  