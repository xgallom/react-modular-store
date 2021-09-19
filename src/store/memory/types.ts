import {StorageItem} from '../../storage';
import React, {Dispatch, SetStateAction} from 'react';

export type StoreConfig<T> = {
    storage?: StorageItem<T>,
};

export type Store<T> = {
    Provider: React.FC,
    useContext: () => [
        T,
        Dispatch<SetStateAction<T>>,
        <K extends keyof T>(key: K, value: T[K]) => void | Promise<void>,
    ],
    useValue: <K extends keyof T>(key: K) => [T[K], ((newValue: T[K]) => void | Promise<void>)],
};
