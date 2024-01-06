import { useState, useMemo } from 'react'
import { FormStoreInstance, Rules } from './types'
import { FormStore } from './store'
export function useFormStore<T extends Object = any>
  (values: T, rules?: Rules):
  [FormStoreInstance<T>, T, React.Dispatch<React.SetStateAction<Partial<T>>>] {
  let [store, changeStore] = useState(values)
  //只在第一次初始化,其他时候不做初始化操作
  let control: FormStoreInstance<T> | null = useMemo(() => {
    return new FormStore(store, changeStore, rules)
  }, [false])
  return [control, store, changeStore]
}
