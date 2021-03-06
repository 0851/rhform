import { Property } from 'csstype'
import { FunctionComponent, ComponentClass } from 'react'
import { DebouncedFunc } from 'lodash'

export interface FormOptions {
  inline?: boolean
  labelWidth?: number
  labelAlign?: Property.TextAlign
  gutter?: number
  componentName?: string
  errorClassName?: string
}

export type ChangeEvent = React.ChangeEvent<(HTMLSelectElement | HTMLInputElement | Element) & { value?: any }>

export type GenericFieldHTMLAttributes =
  | React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>
  | React.DetailedHTMLProps<React.TextareaHTMLAttributes<HTMLTextAreaElement>, HTMLTextAreaElement>
  | React.DetailedHTMLProps<React.SelectHTMLAttributes<HTMLSelectElement>, HTMLSelectElement>;

export interface FormStoreConstructor<T extends Object = any> {
  new(store: T, changed: React.Dispatch<React.SetStateAction<Partial<T>>>, rules?: Rules): FormStoreInstance<T>
  validator: Record<string, ValidatorFn>
}
export interface FormStoreInstance<T extends Object = any> {
  store: T;
  changed: React.Dispatch<React.SetStateAction<Partial<T>>>;
  rules: Rules;
  initialValues: T;
  names: Record<string, number>;
  errors: Record<string, ValidResult>;
  validStacks: Record<string, (Promise<ValidResult> | ValidResult)[]>;
  validLoadings: Record<string, boolean>
  addName (name: string): void;
  removeName (name: string): void;
  addRule (name: string, newRule: Rule): void;
  removeRule (name: string, newRule: Rule): void;
  initStore (v: T): T;
  reset (): void;
  has (name: string): boolean;
  get (name?: string): any | undefined;
  unset (name: string): void;
  set<V> (name: string, v?: V, refresh?: boolean): void;
  refresh (): void;
  setLoading (name: string): void
  unsetLoading (name: string): void
  isLoading (name: string): boolean
  validate: DebouncedFunc<(name?: string | undefined, silent?: boolean | undefined) => Promise<ValidResult>>;
  setError (name: string, msg: string): void;
  unsetError (name: string): void;
  error (name: string): ValidResult;
}

export type ValueGetter = (
  e: ChangeEvent,
  store: FormStoreInstance,
  props: FormFieldProps
) => any

export type AS<P = any> =
  | 'input' | 'select' | 'textarea'
  | FunctionComponent<P> | ComponentClass<P> | string
  | React.ComponentType<P>
  | React.ComponentType
  | React.ForwardRefExoticComponent<P>
  | ((props: P) => JSX.Element)

export type FormFieldProps =
  GenericFieldHTMLAttributes
  & FormOptions
  & {
    name: string;
    as?: AS<any>;
    valueKey?: string | undefined;
    valueGetter?: ValueGetter;
    loadingAs?: AS<any>;
    type?: string;
    value?: any;
    multiple?: boolean;
    rule?: Rule | Rule[];
    ref?: React.LegacyRef<FormFieldProps>;
    validateTrigger?: 'onChange' | 'onBlur' | string;
    children?: ((props: FormFieldProps) => React.ReactNode) | React.ReactNode;
    [key: string]: any
  }


export type ValidResult = string | boolean | undefined | null | void
export type ValidatorFn = ((v: any, opt: any, store: { data: any, rules: Rules, form: FormStoreInstance }) => Promise<ValidResult> | ValidResult)

export type RuleMethod = string | ValidatorFn

export type Rule = {
  fn: RuleMethod,
  opt?: any
}

export type Rules = Record<string, Rule | Rule[]>

export type nameValidators = { name: string, validator: ValidatorFn, opt: any }

export interface FormProps extends FormOptions {
  className?: string
  children?: React.ReactNode
  onSubmit?: (e: React.FormEvent<HTMLFormElement>) => void
  onReset?: (e: React.FormEvent<HTMLFormElement>) => void
  store: FormStoreInstance
  as?: React.ComponentType<any>
  | string
  | ((props: any) => JSX.Element)
  | React.ComponentType
  | React.ForwardRefExoticComponent<any>;
  [key: string]: any
}

export interface FormItemProps extends FormOptions {
  className?: string
  label?: string
  name?: string
  required?: boolean
  labelWidth?: number
  labelAlign?: Property.TextAlign
  error?: any
  suffix?: React.ReactNode
  children?: React.ReactNode
}