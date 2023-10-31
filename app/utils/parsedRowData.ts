// utils/parsedRowData.ts

/**
 * 
 * @param rawData  - csv 를 읽어서 string 으로 받은 데이터
 * @returns 시간 과 value값으로 전환해준다.
 */
export const parsedRowData = (rawData: string) => {
    const lines = rawData.trim().split("\n");
    const headers = lines[0].split(",");
    const datasets: { label: string, data: { x: string, y: number }[] }[] = 
        headers.slice(1).map(ip => ({ label: ip, data: [], borderColor: '...색상...', fill: false }));
    console.log('datasets',datasets);
    lines.slice(1).forEach(line => {
        const values = line.split(",");
        const timestamp = values[0];
        datasets.forEach((dataset, index) => {
            dataset.data.push({ x: timestamp, y: parseFloat(values[index + 1]) });
        });
    });

    return datasets;
}

export function reduceDataByTickInterval(data: any[], tickInterval: number) {
    return data.filter((_, index) => index % tickInterval === 0);
  }
