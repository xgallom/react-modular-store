import {StaticStorageItem, Storage, StorageItem} from './interface';

export class StorageItemImpl<T extends {}, K extends keyof T> implements StorageItem<T[K]> {
    readonly key: K;
    readonly storage: Storage<T>;

    constructor(key: K, storage: Storage<T>) {
        this.key = key;
        this.storage = storage;
    }

    async get(): Promise<T[K] | null> {
        return this.storage.getItem(this.key);
    }

    async set(item: T[K]): Promise<void> {
        return this.storage.setItem(this.key, item);
    }

    async clear(): Promise<void> {
        return this.storage.removeItem(this.key);
    }
}

export class StaticStorageItemImpl<T extends {}, K extends keyof T> implements StaticStorageItem<T[K]> {
    private _value: T[K] | null = null;
    readonly item: StorageItemImpl<T, K>;

    constructor(key: K, storage: Storage<T>) {
        this.item = new StorageItemImpl(key, storage);
    }

    get value(): T[K] | null {
        return this._value;
    }

    set value(newValue: T[K] | null) {
        this._value = newValue;

        if (newValue !== null)
            this.item.set(newValue);
        else
            this.item.clear();
    }

    async init(): Promise<void> {
        this.value = await this.item.get();
    }
}
