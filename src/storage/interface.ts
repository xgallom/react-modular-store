export type Storage = {
    getItem<T>(key: string): Promise<T | null>;
    setItem<T>(key: string, item: T): Promise<void>;
    removeItem(key: string): Promise<void>;
    clear?(): Promise<void>;
    keys?(): Promise<string[]>;
};

export interface StorageItem<T> {
    get(): Promise<T | null>;

    set(item: T): Promise<void>;

    clear(): Promise<void>;
}

export interface StaticStorageItem<T> {
    get value(): T | null;
    set value(newValue: T | null);

    init(): Promise<void>;
}
