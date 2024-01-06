import React from 'react'
import { FormField } from './field'
import { FormOptions } from './types'
import { FormStoreContext } from './custom-context'
import { FormItem } from './item'
import { FormProps } from './types'



export function Form (props: FormProps) {
  const {
    className = '',
    children,
    inline,
    labelWidth,
    errorClassName,
    labelAlign,
    gutter,
    store,
    as,
    componentName = 'rhform',
    onSubmit,
    onReset,
    ...options
  } = props

  let opts: FormOptions = {
    inline,
    labelWidth,
    gutter,
    componentName,
    errorClassName,
    labelAlign
  }

  const classNames = [componentName, className].filter(n => !!n).join(' ')

  const newOnSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault()
    try {
      if (onSubmit) {
        await store.validate()
        onSubmit && onSubmit(e)
      }
    } catch (error) { }
  }

  const newOnReset = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    store.reset()
    onReset && onReset(e)
  }

  return (
    <FormStoreContext.Provider value={{ store, opts }}>
      {
        !as ? <>{children}</> :
          (
            as === 'form' ?
              React.createElement('form', {
                className: classNames,
                onSubmit: newOnSubmit,
                onReset: newOnReset,
                ...options
              }, children)
              :
              React.createElement(as, {
                className: classNames,
                ...options
              }, children)
          )
      }

    </FormStoreContext.Provider>
  )
}

Form.Field = FormField
Form.Item = FormItem