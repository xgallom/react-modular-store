import React from 'react';

export const reduceStoreProviders = (providers: React.FC[]): React.FC => (
    ({children}) => (
        <>
            {providers.reduce((child, Provider) => (
                    <Provider>
                        {child}
                    </Provider>
                ),
                children,
            )}
        </>
    )
);
