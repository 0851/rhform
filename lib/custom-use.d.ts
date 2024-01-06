/// <reference types="react" />
import { FormStoreInstance, Rules } from './types';
export declare function useFormStore<T extends Object = any>(values: T, rules?: Rules): [FormStoreInstance<T>, T, React.Dispatch<React.SetStateAction<Partial<T>>>];
