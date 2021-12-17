import React, {Dispatch, SetStateAction, useContext, useEffect, useState} from 'react';
import {createMemoryStore} from '../memory/create';
import {LoadHandler, SaveHandler, StorageStore, StorageStoreImplConfig} from './types';

export const createStorageStoreImpl = <T extends {}>(
    defaultValue: T,
    {storage, storageManagerHandler}: StorageStoreImplConfig<T>,
): StorageStore<T> => {
    const memoryStore = createMemoryStore(defaultValue);

    const load: LoadHandler<T> = (setValueState: Dispatch<SetStateAction<T>>) => {
        return storage.get()
            .then(value => {
                if (value)
                    setValueState(value);

                return value;
            });
    };

    const save: SaveHandler<T> = (valueState: T) => {
        return storage.set(valueState);
    };

    const StorageManager: React.FC = ({children}) => {
        const [valueState, setValueState] = memoryStore.useContext();

        useEffect(() => {
            load(setValueState);
        }, []);

        storageManagerHandler({
            valueState,
            setValueState,
            load,
            save,
        });

        return <>{children}</>;
    };

    const Provider: React.FC = ({children}) => (
        <memoryStore.Provider>
            <StorageManager>
                {children}
            </StorageManager>
        </memoryStore.Provider>
    );

    const useSaveValue = <K extends keyof T>(key: K) => {
        const [valueState, , setStoreValue] = memoryStore.useContext();
        const [value, setValue] = [
            valueState[key],
            (newValue: T[K]) => setStoreValue(key, newValue),
        ] as [T[K], (newValue: T[K]) => void];
        const [cachedValue, setCachedValue] = useState<T[K]>(value);

        useEffect(() => {
            if (value !== cachedValue) {
                setValue(cachedValue);
                save({
                    ...valueState,
                    [key]: cachedValue,
                });
            }
        }, [value, cachedValue, setValue]);

        return setCachedValue;
    };

    return {
        Provider,
        useContext: memoryStore.useContext,
        useValue: memoryStore.useValue,
        useSaveValue,
        useSave() {
            const [valueState] = memoryStore.useContext();
            return () => save(valueState);
        },
    };
};
