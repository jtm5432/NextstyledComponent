import axios from 'axios';
import ProviderQueueManager from './ProviderQueueManager';

class QueryQueueManager {
    private static processingMap: Record<string, boolean> = {};
    private static inProgressCountMap: Record<string, number> = {};
    static enqueue(providerName: string, endpoint: string, params?: Record<string, any>) {
        const queue = ProviderQueueManager.getOrCreateQueue(providerName);
      
        const task = async () => {
            try {
                console.log('endpoint',endpoint,params);

                if (typeof endpoint !== 'string' || (params && typeof params !== 'object')) {
                   
                }
                else {
                const response = await axios.get(endpoint, { params });
                return response.data;
            }
            } catch (error) {
                console.error("Error in query:", error);
            } finally {
                // 작업이 완료되면 실행 중인 작업의 수를 감소시킵니다.
                this.inProgressCountMap[providerName]--;
                // 다음 작업을 시작하도록 합니다.
                this.executeNext(providerName);
            }
        };
        queue.enqueue(task);
        if (!this.processingMap[providerName]) {
            this.processInBatches(providerName, 3);
        }
    }
    

    static executeNext(providerName: string) {
        const queue = ProviderQueueManager.getOrCreateQueue(providerName);
        const inProgress = this.inProgressCountMap[providerName] || 0;
        if (queue.length > 0 && inProgress < 3) {
            const task = queue.dequeue()!;
            this.inProgressCountMap[providerName] = inProgress + 1;
            task();
        }
    }

    static processInBatches(providerName: string, batchSize: number) {
        this.processingMap[providerName] = true;

        for (let i = 0; i < batchSize; i++) {
            this.executeNext(providerName);
        }
    }
}

export default QueryQueueManager;
