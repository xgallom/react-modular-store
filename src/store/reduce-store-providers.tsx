import React from 'react';

export const reduceStoreProviders = (providers: React.FC[]): React.FC => (
    ({children}) => (
        <>
            {providers.reduceRight((children, Provider) => (
                    <Provider>
                        {children}
                    </Provider>
                ),
                children,
            )}
        </>
    )
);
