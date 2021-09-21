export interface BaseStorage<T extends {} = Record<string, any>> {
    getItem<K extends keyof T>(key: K): Promise<T[K] | null>;
    setItem<K extends keyof T>(key: K, item: T[K]): Promise<void>;
    removeItem<K extends keyof T>(key: K): Promise<void>;
}

export interface Storage<T extends {} = Record<string, any>> extends BaseStorage<T> {
    init(): Promise<void>;

    clear(): Promise<void>;
    keys(): Promise<(keyof T)[]>;
    multiGet<K extends keyof T>(keys: K[]): Promise<(T[K] | null)[]>;

    Item<K extends keyof T>(key: K): StorageItem<T[K]>;
    StaticItem<K extends keyof T>(key: K): StaticStorageItem<T[K]>;
}

export type BaseStorageMixin<TI extends {} = Record<any, any>,
    TO extends TI = Record<any, any>,
    SI = BaseStorage<TI>,
    SO = BaseStorage<TO> & BaseStorage<TI>> = (storage: SI) => SO;

export interface StorageItem<T = any> {
    get(): Promise<T | null>;

    set(item: T): Promise<void>;

    clear(): Promise<void>;
}

export interface StaticStorageItem<T = any> {
    get value(): T | null;
    set value(newValue: T | null);

    init(): Promise<void>;
}
