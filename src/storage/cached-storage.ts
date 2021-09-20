import {Storage} from './interface';
import {StaticStorageItemImpl, StorageItemImpl} from './implementation';

export type CachedStorageOptions = {
    metaKey?: string;
    keyPrefix?: string;
};

export class CachedStorage implements Storage {
    readonly metaKey: string;
    readonly keyPrefix: string;
    private cache: Record<string, any> = {};
    private storage: Storage;

    constructor(options: CachedStorageOptions, storage: Storage) {
        this.metaKey = options.metaKey || 'meta';
        this.keyPrefix = options.keyPrefix ? `${options.keyPrefix}-` : '';
        this.storage = storage;
    }

    protected getKeyFor(key: string): string {
        return this.keyPrefix + key;
    }

    async getItem<T>(key: string): Promise<T | null> {
        const item = await this.storage.getItem<T>(this.getKeyFor(key));
        this.cache[key] = item;
        return item;
    }

    async removeItem(key: string): Promise<void> {
        delete this.cache[key];
        return this.storage.removeItem(this.getKeyFor(key));
    }

    async setItem<T>(key: string, item: T): Promise<void> {
        this.cache[key] = item;
        return this.storage.setItem(this.getKeyFor(key), item);
    }

    async clear(): Promise<void> {
        await Promise.all(
            Object.keys(this.cache)
                .map(key => this.storage.removeItem(this.getKeyFor(key))),
        );

        this.cache = {};
    }

    async keys(): Promise<string[]> {
        return Object.keys(this.cache);
    }

    Item<T>(key: string) {
        return new StorageItemImpl<T>(key, this);
    }

    StaticItem<T>(key: string) {
        return new StaticStorageItemImpl<T>(key, this);
    }
}

export const createCachedStorage = (storage: Storage) =>
    (options: CachedStorageOptions): Storage => new CachedStorage(options, storage);

