import {StaticStorageItem, Storage, StorageItem} from './interface';

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

    async clear(): Promise<void> {
        return this.storage.removeItem(this.key);
    }
}

export class StaticStorageItemImpl<T> implements StaticStorageItem<T> {
    _value: T | null = null;
    _item: StorageItemImpl<T>;

    constructor(key: string, storage: Storage) {
        this._item = new StorageItemImpl(key, storage);
    }

    get value(): T | null {
        return this._value;
    }

    set value(newValue: T | null) {
        this._value = newValue;

        if (newValue !== null)
            this._item.set(newValue);
        else
            this._item.clear();
    }

    async init(): Promise<void> {
        this.value = await this._item.get();
    }
}
