import React, {createContext, Dispatch, SetStateAction, useContext, useState} from 'react';
import {Store} from './types';

export const createMemoryStore = <T extends {}>(defaultValue: T): Store<T> => {
    const setValueDummy = <K extends keyof T>(key: K, value: T[K]) => {
    };

    const Context = createContext([
        defaultValue,
        () => {
        },
        setValueDummy,
    ] as [
        T,
        Dispatch<SetStateAction<T>>,
        typeof setValueDummy,
    ]);

    const Provider: React.FC = ({children}) => {
        const [valueState, setValueState] = useState(defaultValue);

        const setValue = <K extends keyof T>(key: K, value: T[K]) => {
            setValueState({
                ...valueState,
                [key]: value,
            });
        };

        return (
            <Context.Provider value={[valueState, setValueState, setValue]}>
                {children}
            </Context.Provider>
        );
    };

    // TODO: Add state to avoid race conditions
    const useValue = <K extends keyof T>(key: K) => {
        const [value, , setValue] = useContext(Context);
        return [value[key], (newValue: T[K]) => setValue(key, newValue)] as [T[K], (newValue: T[K]) => void];
    };

    return {
        Provider,
        useContext: () => useContext(Context),
        useValue,
    };
};
