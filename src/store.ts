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
  validStacks: Record<string, Promise<any>[]>
  validLoadings: Record<string, boolean>
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
    this.errors = {}
    this.validStacks = {}
    this.validLoadings = {}
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
    // console.log(JSON.stringify(this.store), '====store');
    this.changed({ ...this.store })
  }
  setLoading (name: string): void {
    this.validLoadings[name] = true
    this.refresh()
  }
  unsetLoading (name: string): void {
    this.validLoadings[name] = false
    this.refresh()
  }
  isLoading (name: string): boolean {
    return !!this.validLoadings[name]
  }
  setError (name: string, msg: string): void {
    lodashSet(this.errors, `${name}`, msg)
    this.refresh()
  }
  unsetError (name: string): void {
    lodashUnset(this.errors, `${name}`)
    this.refresh()
  }
  error (name: string): ValidResult {
    return lodashGet(this.errors, `${name}`)
  }
  private async fnTimeOut<T extends any> (value: Promise<T>, fn: any, time: number) {
    let res: any = PromiseTimeout<T>(fn, time).catch((e) => { throw e })
    res.id = Math.random()
    res.value = value
    return res
  }
  private async runLast (name: string, v: any, validators: nameValidators[]): Promise<undefined | boolean> {
    this.validStacks[name] = this.validStacks[name] || []
    let pt = this.fnTimeOut(v, this.validByName(v, validators), 3000)
    this.validStacks[name].unshift(pt)
    let getLast = () => (this.validStacks[name] || [])[0]
    return new Promise((resolve, reject) => {
      setTimeout(async () => {
        let last: Promise<boolean> = getLast()
        this.setLoading(name)
        if (!last) {
          resolve(undefined)
        }
        let res: any = await last
        if (getLast() === last) {
          this.unsetLoading(name)
          this.validStacks[name] = []
          if (res === true) {
            this.unsetError(name)
            resolve(res)
          } else {
            let message = isString(res) ? res : res?.message
            this.setError(name, `${message}`)
            reject(res)
          }
        }
      })
    })
  }
  private async validByName (value: any, validators: nameValidators[]): Promise<boolean> {
    try {
      await Promise.all(validators.map(async (v) => {
        try {
          let res = await v.validator(
            value,
            v.opt,
            {
              data: this.store,
              rules: this.rules,
              form: this
            }
          )
          if (res === false) {
            throw new Error(`${name} error`)
          } else if (res === true || res === undefined || res === null) {
            return true
          } else {
            throw res
          }
        } catch (error) {
          throw error
        }
      }))
      return true
    } catch (error) {
      return error
    }
  }
  validate = debounce(async (name?: string, silent?: boolean): Promise<ValidResult> => {
    const names = Object.keys(this.rules).filter((item) => {
      if (!name) return true
      return item === name
    })
    let validAll = names.map((name) => {
      try {
        let rule = this.rules[name]
        let validators: nameValidators[] = []
        let v = this.get(name)
        getValidatorFn(validators, name, rule)
        return this.runLast(name, v, validators)
      } catch (error) {
        throw error
      }
    })
    try {
      await Promise.all(validAll)
      return true
    } catch (error) {
      let message = isString(error) ? error : error?.message
      let e: Error = new Error(message)
      if (silent !== true) {
        throw e
      }
    }
  }, 88, { leading: true, trailing: true })
}