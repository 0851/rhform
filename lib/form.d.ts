/// <reference types="react" />
import { FormField } from './field';
import { FormItem } from './item';
import { FormProps } from './types';
export declare function Form(props: FormProps): JSX.Element;
export declare namespace Form {
    var Field: typeof FormField;
    var Item: typeof FormItem;
}
