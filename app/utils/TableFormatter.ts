export function formatDate(timestamp: number) {
    const options: Intl.DateTimeFormatOptions = {
        year: 'numeric',
        month: 'numeric', // 'long'을 'numeric'으로 변경
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
        timeZone: 'Asia/Seoul',
        hour12: false // 24시간 형식
    };
    const formatter = new Intl.DateTimeFormat('ko-KR', options);
    // 결과 문자열을 조정하여 원하는 형식으로 만듭니다.
    return formatter.format(new Date(timestamp)).replace('일 ', '일 ').replace(',', '');
}
