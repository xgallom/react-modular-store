import React, {Dispatch, SetStateAction, useEffect} from 'react';
// import {AppState, AppStateStatus} from 'react-native';
import {createMemoryStore} from '../memory/create';
import {LoadHandler, SaveHandler, StorageStore, StorageStoreConfig} from './types';

export const createStorageStoreImpl = <T extends {}>(
    defaultValue: T,
    {storage, storageManagerHandler}: StorageStoreConfig<T>,
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

        /* TODO: MOVE TO RN STORAGE
                if (!notAutomatic) {
                    useEffect(() => {
                        const onAppStateChange = (appState: AppStateStatus) => {
                            if (appState !== 'active')
                                save(valueState);
                        };

                        AppState.addEventListener('change', onAppStateChange);
                        return () => {
                            AppState.removeEventListener('change', onAppStateChange);
                        };
                    }, [valueState]);
                }
        */
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
        const [valueState, setValueState] = memoryStore.useContext();

        return (value: T[K]) => {
            const newValueState = {
                ...valueState,
                [key]: value,
            };

            setValueState(newValueState);
            return save(newValueState);
        };
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
