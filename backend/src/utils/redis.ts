import { EventEmitter } from 'events';

class MockRedis extends EventEmitter {
    private store = new Map<string, string>();

    constructor() {
        super();
        console.log(' Using In-Memory Mock Redis (No system dependency required)');
    }

    async connect() {
        this.emit('connect');
        return Promise.resolve();
    }

    async get(key: string) {
        return this.store.get(key) || null;
    }

    async set(key: string, value: string, options?: any) {
        this.store.set(key, value);
        return 'OK';
    }

    async disconnect() {
        this.emit('end');
    }
}

const redisClient = new MockRedis();
export default redisClient;
