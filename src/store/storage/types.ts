import {Dispatch, SetStateAction} from 'react';
import {StorageItem} from '../../storage';
import {Store} from '../memory';

export type LoadHandler<T> = (setValueState: Dispatch<SetStateAction<T>>) => Promise<T | null>;
export type SaveHandler<T> = (valueState: T) => Promise<void>;

export type StorageManagerHandlerHelpers<T> = {
    valueState: T,
    setValueState: Dispatch<SetStateAction<T>>,
    load: LoadHandler<T>,
    save: SaveHandler<T>,
};

export type StorageStoreConfig<T> = {
    storage: StorageItem<T>,
    storageManagerHandler: (options: StorageManagerHandlerHelpers<T>) => void,
};

export type StorageStore<T> = Store<T> & {
    useSave: () => (() => Promise<void>),
    useSaveValue: <K extends keyof T>(key: K) => ((valueState: T[K]) => Promise<void>),
};

