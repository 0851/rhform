import {
  lodashCloneDeep,
  lodashGet,
  lodashSet,
  lodashUnset,
  lodashHas,
  isString,
  isFunction,
  debounce,
} from './lodash'

import {
  ValidResult,
  ValidatorFn,
  Rule,
  Rules,
  nameValidators,
  FormStoreConstructor
} from './types'

import { validator } from './rules'

function remove<T> (items: T[], item: T): T[] {
  let index = items.findIndex((obj) => {
    return obj === item
  })
  if (index >= 0) {
    items.splice(index, 1)
  }
  return items
}

function PromiseTimeout<T, P = Promise<T> | T> (promise: P, delay: number): Promise<T extends PromiseLike<infer U> ? U : T> {
  let timeout: Promise<any> = new Promise((_, reject) => {
    setTimeout(function () {
      reject('Timeout.')
    }, delay)
  })
  return Promise.race([timeout, promise])
}

function getValidatorFn (validators: nameValidators[],
  name: string, rule: Rule | Rule[]) {
  let rules: Rule[] = []
  if (Array.isArray(rule)) {
    rules = rule
  } else {
    rules = [rule]
  }
  rules.forEach((validator: Rule) => {
    let fn = validator.fn
    let opt = validator.opt
    if (isString(fn) && FormStore.validator[fn]) {
      fn = FormStore.validator[fn]
    }
    if (isFunction(fn)) {
      validators.push({
        name: name,
        validator: fn,
        opt
      })
    }
  })
}

export const FormStore: FormStoreConstructor = class FormStore<T extends Object = any>   {
  public static validator: Record<string, ValidatorFn> = validator
  initialValues: T
  names: Record<string, number>
  errors: Record<string, ValidResult>
  validStacks: Record<string, Promise<boolean>[]>
  validLoadings: Record<string, number>
  constructor (
    public store: T,
    public changed: React.Dispatch<React.SetStateAction<Partial<T>>>,
    public rules: Rules = {}
  ) {
    this.initialValues = lodashCloneDeep(store)
    this.store = this.initStore(store)
    this.changed = changed
    this.rules = rules
    this.errors = {}
    this.names = {}
    this.validStacks = {}
    this.validLoadings = {}
  }
  addName (name: string): void {
    this.names[name] = (this.names[name] || 0) + 1
  }
  removeName (name: string): void {
    this.names[name] = this.names[name] && this.names[name] > 0 ? this.names[name] - 1 : 0
  }
  addRule (name: string, newRule: Rule): void {
    this.removeRule(name, newRule)
    let rule = this.rules[name]
    rule = Array.isArray(rule) ? rule : (!!rule ? [rule] : [])
    rule.push(newRule)
    this.rules[name] = rule
  }
  removeRule (name: string, newRule: Rule): void {
    let rule = this.rules[name]
    rule = Array.isArray(rule) ? rule : (!!rule ? [rule] : [])
    this.rules[name] = remove(rule, newRule)
  }
  initStore (v: T): T {
    return v
  }
  reset (): void {
    this.store = lodashCloneDeep(this.initialValues)
    this.refresh()
  }
  has (name: string): boolean {
    return lodashHas(this.store, name)
  }
  get (name?: string): any | undefined {
    if (name) {
      return lodashGet(this.store, `${name}`)
    }
    return this.store
  }
  unset (name: string): void {
    lodashUnset(this.store, name)
    lodashUnset(this.errors, name)
    delete this.rules[name]
    this.validStacks = {}
    this.validLoadings = {}
    this.refresh()
  }
  set<V> (name: string, v?: V, refresh?: boolean): void {
    lodashSet(this.store, `${name}`, v)
    if (refresh !== false) {
      this.refresh()
    }
  }
  refresh () {
    this.changed({ ...this.store })
  }
  setLoading (name: string): void {
    this.validLoadings[name] = (this.validLoadings[name] || 0) + 1
  }
  unsetLoading (name: string): void {
    this.validLoadings[name] = (this.validLoadings[name] || 0) - 1
  }
  isLoading (name: string): boolean {
    return this.validLoadings[name] > 0
  }
  private async fntimeout (name: string, fn: Promise<boolean>) {
    return PromiseTimeout<boolean>(fn, 5000).finally(() => {
      this.unsetLoading(name)
      setTimeout(() => {
        this.validStacks[name] = remove(this.validStacks[name], fn)
      })
    })
  }
  private async runlast (name: string): Promise<undefined | boolean> {
    try {
      let last: Promise<boolean> = (this.validStacks[name] || [])[0]
      if (!last) {
        return
      }
      let res = await last
      this.unsetError(name)
      return res
    } catch (error) {
      let message = isString(error) ? error : error?.message
      this.setError(name, `${message}`)
      throw error
    }
  }
  private async validbyname (validators: nameValidators[]): Promise<boolean> {
    try {
      await Promise.all(validators.map(async (v) => {
        let res = await v.validator(
          this.get(v.name),
          v.opt,
          {
            data: this.store,
            rules: this.rules,
            form: this
          }
        )
        if (res === false) {
          throw new Error(`${name} error`)
        } else if (res === true) {
          return true
        } else {
          throw res
        }
      }))
      return true
    } catch (error) {
      throw error
    }
  }
  validate = debounce(async (name?: string, refresh?: boolean, silent?: boolean): Promise<ValidResult> => {
    const names = Object.keys(this.rules).filter((item) => {
      if (!name) return true
      return item === name
    })
    let validsall = names.map(async (name) => {
      let rule = this.rules[name]
      let validators: nameValidators[] = []
      getValidatorFn(validators, name, rule)
      this.validbyname(validators)
      try {
        return
      } catch (error) {
        let message = isString(error) ? error : error?.message
        this.setError(name, `${message}`)
        throw error
      }
      // this.validStacks[v.name] = this.validStacks[v.name] || []
      // this.validStacks[v.name].unshift(fn)
      // this.setLoading(v.name)
      // await this.runlast(name)
    })
    try {
      await Promise.all(validsall)
      return true
    } catch (error) {
      let message = isString(error) ? error : error?.message
      let e: Error = new Error(message)
      if (silent !== true) {
        throw e
      }
    } finally {
      if (refresh !== false) {
        this.refresh()
      }
    }
  }, 66, { leading: true, trailing: true })
  setError (name: string, msg: string): void {
    lodashSet(this.errors, `${name}`, msg)
  }
  unsetError (name: string): void {
    lodashUnset(this.errors, `${name}`)
  }
  error (name: string): ValidResult {
    return lodashGet(this.errors, `${name}`)
  }
}