import React from 'react';
import { FormOptions, FormStoreInstance } from './types';
export declare const FormStoreContext: React.Context<{
    store?: FormStoreInstance<any> | undefined;
    opts?: FormOptions | undefined;
}>;
