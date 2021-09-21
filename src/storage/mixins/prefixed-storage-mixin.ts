import {BaseStorage, BaseStorageMixin} from '../interface';

export type PrefixedStorageOptions = {
    keyPrefix: string;
};

class PrefixedStorageMixinImpl<T extends {} = Record<string, any>> implements BaseStorage<T> {
    readonly keyPrefix: string;
    private storage: BaseStorage;

    constructor(options: PrefixedStorageOptions, storage: BaseStorage<T>) {
        this.keyPrefix = `${options.keyPrefix}-`;
        this.storage = storage;
    }

    protected getKeyFor<K extends keyof T>(key: K): string {
        return this.keyPrefix + key;
    }

    getItem<K extends keyof T>(key: K): Promise<T[K] | null> {
        return this.storage.getItem(this.getKeyFor(key));
    }

    setItem<K extends keyof T>(key: K, item: T[K]): Promise<void> {
        return this.storage.setItem(this.getKeyFor(key), item);
    }

    removeItem<K extends keyof T>(key: K): Promise<void> {
        return this.storage.removeItem(this.getKeyFor(key));
    }
}

export const PrefixedStorageMixin = (options: PrefixedStorageOptions): BaseStorageMixin =>
    <T extends {}>(storage: BaseStorage<T>): BaseStorage<T> => new PrefixedStorageMixinImpl(options, storage);
