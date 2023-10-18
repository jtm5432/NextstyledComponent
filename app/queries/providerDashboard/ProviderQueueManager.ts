class Queue<T> {
    private tasks: T[] = [];
  
    enqueue(task: T) {
      this.tasks.push(task);
    }
  
    dequeue(): T | undefined {
      return this.tasks.shift();
    }
  
    get length() {
      return this.tasks.length;
    }
  }
  
  class ProviderQueueManager {
    private static queues: Record<string, Queue<() => Promise<void>>> = {};
  
    static getOrCreateQueue(providerName: string) {
      if (!this.queues[providerName]) {
        this.queues[providerName] = new Queue<() => Promise<void>>();
      }
  
      return this.queues[providerName];
    }
  
    static async processQueue(providerName: string) {
      const queue = this.getOrCreateQueue(providerName);
  
      while (queue.length > 0) {
        const task = queue.dequeue();
        if (task) await task();
      }
    }
  }
  
  export default ProviderQueueManager;
  