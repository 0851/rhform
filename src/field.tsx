import React, { useContext, useEffect, useCallback } from 'react'
import {
  defaultTo,
  has,
} from './lodash'
import { ChangeEvent, FormFieldProps, FormStoreInstance } from './types'
import { FormStoreContext } from './custom-context'

function defaultValueGetter (
  e: ChangeEvent,
  store: FormStoreInstance,
  props: FormFieldProps
) {
  let item = e.target.value;
  let name = props.name
  let type = props.type
  let v = store.get(name)

  if (props.multiple === true || (store.names[name] > 1 && type === 'checkbox')) {
    v = Array.isArray(v) ? v : (v ? [v] : [])
    let index = v.indexOf(item);
    index === -1 ? v.push(item) : v.splice(index, 1);
    return v
  }
  return item
}
export function FormField (props: FormFieldProps) {
  const {
    name,
    as = 'input',
    loadingAs,
    valueKey = "value",
    valueGetter,
    type,
    value,
    rule,
    ref,
    validateTrigger = 'onChange',
    children,
    multiple,
    onCompositionStart,
    onCompositionEnd,
    ...restProps
  } = props

  const { store } = useContext(FormStoreContext)

  useEffect(() => {
    store?.addName && (store?.addName(name))
    if (rule) {
      let rules = Array.isArray(rule) ? rule : [rule]
      rules.forEach((rule) => {
        store?.addRule(name, rule)
      })
    }
    return () => {
      store?.removeName && (store?.removeName(name))
      if (rule) {
        let rules = Array.isArray(rule) ? rule : [rule]
        rules.forEach((rule) => {
          store?.removeRule(name, rule)
        })
      }
    }
  }, [name])

  let newProps: Partial<FormFieldProps> = {
    value,
    ...restProps
  }

  if (ref) {
    newProps['ref'] = ref
  }
  if (multiple !== undefined) {
    newProps['multiple'] = multiple
  }
  if (type !== undefined) {
    newProps['type'] = type
  }
  if (name !== undefined) {
    newProps['name'] = name
  }

  if (!store) {
    return React.createElement(as, newProps, children)
  }

  if (!(has(props, 'value') && valueKey === 'value')) {
    let initValue = multiple === true ? [] : ''
    let currentValue = store.has(name) ? store.get(name) : defaultTo(value, initValue);
    newProps[valueKey] = currentValue;
  }

  if (type === 'radio' || type === 'checkbox') {
    let v = store.get(name)
    newProps['checked'] = Array.isArray(v) ? (v.indexOf(value) >= 0) : (v === value)
  }

  let onChange = useCallback((e: ChangeEvent) => {
    let v = valueGetter ? valueGetter(e, store, props) : defaultValueGetter(e, store, props);
    store.set(name, v)
    if (validateTrigger !== 'onChange') {
      return
    }
    try {
      store.validate(name, true)
    } catch (error) { }
  }, [store, name, valueGetter])

  if (validateTrigger !== 'onChange' && !!validateTrigger) {
    newProps[validateTrigger] = () => {
      try {
        store.validate(name, true)
      } catch (error) { }
    }
  }

  newProps.onChange = onChange

  // let [s, sets] = useState('')
  // newProps.value = s
  // newProps.onChange = (e: any) => {
  //   sets(e.target.value)
  // }

  return <>{React.createElement(as, newProps, children)}{store.isLoading(name) && loadingAs ? loadingAs : undefined}</>
}