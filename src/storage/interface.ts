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
}

export interface StaticStorageItem<T> extends StorageItem<T> {
    set(item: T): Promise<void>;

    init(): Promise<void>;
}
