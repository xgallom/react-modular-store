import {BaseStorage, StaticStorageItem, Storage, StorageItem} from './interface';
import {StaticStorageItemImpl, StorageItemImpl} from './implementation';

const MetaKey = '__meta';

type CacheObject<T extends {}> = { [K in keyof T]: T[K] | null };

export class CachedStorage<T extends {} = Record<string, any>> implements Storage<T> {
    private cache: CacheObject<T> = {} as CacheObject<T>;
    private storage: BaseStorage;

    constructor(storage: BaseStorage<T>) {
        this.storage = storage;
    }

    protected async getMeta(): Promise<(keyof T)[]> {
        return (await this.storage.getItem(MetaKey) || []) as (keyof T)[];
    }

    protected async setMeta(keys: (keyof T)[]): Promise<void> {
        return this.storage.setItem(MetaKey, keys);
    }

    protected cachedMeta(): (keyof T)[] {
        return (Object.keys(this.cache) as (keyof T)[])
            .filter(key => this.cache[key] != null);
    }

    protected async saveMeta(): Promise<void> {
        return this.setMeta(this.cachedMeta());
    }

    private async dangerouslyGetItem<K extends keyof T>(key: K): Promise<T[K] | null> {
        const cacheItem = this.cache[key];

        if (cacheItem != null)
            return cacheItem;

        const item = await this.storage.getItem(key.toString());

        this.cache[key] = item;
        return item;
    }

    async init(): Promise<void> {
        const keys = await this.getMeta();
        const getItem = (key: keyof T) => this.dangerouslyGetItem(key);
        await Promise.all(keys.map(getItem));
    }

    async getItem<K extends keyof T>(key: K): Promise<T[K] | null> {
        const item = await this.dangerouslyGetItem(key);

        this.saveMeta();

        return item;
    }

    async removeItem<K extends keyof T>(key: K): Promise<void> {
        delete this.cache[key];

        await this.storage.removeItem(key.toString());

        this.saveMeta();
    }

    async setItem<K extends keyof T>(key: K, item: T[K]): Promise<void> {
        this.cache[key] = item;

        await this.storage.setItem(key.toString(), item);

        this.saveMeta();
    }

    async clear(): Promise<void> {
        const removeItem = (key: keyof T) => this.storage.removeItem(key.toString());
        await Promise.all(this.cachedMeta().map(removeItem));

        this.cache = {} as CacheObject<T>;
        this.saveMeta();
    }

    async keys(): Promise<(keyof T)[]> {
        return Object.keys(this.cache) as (keyof T)[];
    }

    async multiGet<K extends keyof T>(keys: K[]): Promise<(T[K] | null)[]> {
        const items = await Promise.all(keys.map(key => this.dangerouslyGetItem(key)));

        this.saveMeta();

        return items;
    }

    Item<K extends keyof T>(key: K): StorageItem<T[K]> {
        return new StorageItemImpl<T, K>(key, this);
    }

    StaticItem<K extends keyof T>(key: K): StaticStorageItem<T[K]> {
        return new StaticStorageItemImpl<T, K>(key, this);
    }
}

export const createCachedStorage = <T extends {}>(storage: BaseStorage<T>): Storage<T> => new CachedStorage<T>(storage);
