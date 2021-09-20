import {Storage} from './interface';

export type CachedStorageOptions = {
    metaKey?: string;
    keyPrefix?: string;
};

export abstract class CachedStorage implements Storage {
    readonly metaKey: string;
    readonly keyPrefix: string;
    private storage: Record<string, any> = {};

    protected constructor(options: CachedStorageOptions) {
        this.metaKey = options.metaKey || 'meta';
        this.keyPrefix = options.keyPrefix ? `${options.keyPrefix}-` : '';
    }

    _getKeyFor(key: string): string {
        return this.keyPrefix + key;
    }

    abstract getItem<T>(key: string): Promise<T | null>;

    abstract removeItem(key: string): Promise<void>;

    abstract setItem<T>(key: string, item: T): Promise<void>;

    async clear(): Promise<void> {
        await Promise.all(Object.keys(this.storage).map(key => this.removeItem(key)));
        this.storage = {};
    }

    async keys(): Promise<string[]> {
        return Object.keys(this.storage);
    }
}

