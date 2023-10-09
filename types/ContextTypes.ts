export type HandleItemClickProps = {
    id: string;
    event?: React.MouseEvent;
    props?: {
        gridId?: string;
        [key: string]: any; // 추가적인 프로퍼티들을 위한 인덱스 시그니처 (필요하다면)
    };
};