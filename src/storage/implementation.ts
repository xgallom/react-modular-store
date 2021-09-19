import {Storage, StorageItem} from './interface';

export class StorageItemImpl<T> implements StorageItem<T> {
    key: string;
    storage: Storage;

    constructor(key: string, storage: Storage) {
        this.key = key;
        this.storage = storage;
    }

    async get(): Promise<T | null> {
        return this.storage.getItem(this.key);
    }

    async set(item: T): Promise<void> {
        return this.storage.setItem(this.key, item);
    }
}

export class StaticStorageItemImpl<T> extends StorageItemImpl<T> {
    value: T | null = null;

    set(item: T): Promise<void> {
        this.value = item;
        return this.storage.setItem(this.key, item);
    }

    async init(): Promise<void> {
        this.value = await this.get();
    }
}
