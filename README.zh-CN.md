# rhform

> 一个表单组件. [灵感](https://github.com/varHarrie/react-hero-form)

## 安装

```bash
npm install rhform --save
# or
yarn add rhform
```

## 重置

```typescript
const store = new FormStore({ name: 'test' })
store.reset()
```

## 验证

```typescript
function assert(condition, message) {
  if (!condition) throw new Error(message)
}
const rules = {
  name: (val) => assert(!!val && !!val.trim(), 'Name is required'),
}
const store = new FormStore({}, rules)
// ...
try {
  const values = await store.validate()
  console.log('values:', values)
} catch (error) {
  console.log('error:', error)
}
```

### Hook

```jsx
function App() {
  const [store] = useFormStore(
    {
      username: 'Default',
      password: '',
      gender: 'male',
      contact: {
        phone: '1n2,mk8798y23,cLKJlk1',
        address: 'sdsdsd1',
        checkbox: [],
        radio: '',
      },
    },
    {
      username: {
        fn(v) {
          return new Promise((resolve, reject) => {
            setTimeout(() => {
              if (v === 'as') {
                reject('error这是一个错误')
              }
              //promise 验证方法, 必须明确结果, 不然验证会超时
              resolve()
            }, 1000)
          })
        },
      },
      radio: {
        fn(v) {
          if (v === 'radio1') {
            return '错误'
          }
        },
      },
    }
  )

  // console.log(store, '===+++==')

  const onReset = React.useCallback((e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    console.log(JSON.stringify(store), 'reseted')
  }, [])

  const onSubmit = React.useCallback(async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    console.log(JSON.stringify(store), 'submit')
  }, [])

  return (
    <Form
      as='form'
      store={store}
      onSubmit={onSubmit}
      onReset={onReset}
      inline={boolean('Inline', false)}
      labelWidth={number('Label Width', 120)}
      labelAlign={select('labelAlign', ['left', 'right', 'center'], 'left')}
      gutter={number('Gutter', 20)}
    >
      <Form.Item
        required={boolean('RequiredName', true)}
        error={store.error('username')}
        label='username'
      >
        <Form.Field type='text' name='username' rule={{ fn: 'required' }} loadingAs='loading...' />
        {store.get('username')}
      </Form.Item>
      <Form.Item
        required={boolean('RequiredRadioCheckbox', false)}
        label='radio checkbox'
        error={store.error('radio')}
      >
        <div>
          <Form.Field type='radio' name='radio' value='radio1' />
          <Form.Field type='radio' name='radio' value='radio2' />
          {store.get('radio')}
        </div>
        <Form.Field type='checkbox' name='checkbox' value='checkbox1' />
        <Form.Field type='checkbox' name='checkbox' value='checkbox2' />
        <Form.Field type='checkbox' name='checkbox' value='checkbox3' />
        {(Array.isArray(store.get('checkbox'))
          ? store.get('checkbox')
          : [store.get('checkbox')]
        ).map((i) => {
          return i
        })}
      </Form.Item>
      <Form.Item label='Gender' error={store.error('contact.phone')}>
        <Form.Field as='select' multiple name='select'>
          <option value='male'>Male</option>
          <option value='female'>Female</option>
          <option value='1d'>1d</option>
          <option value='czxc'>czxc</option>
          <option value='13f'>13f</option>
        </Form.Field>
        {(store.get('select') || []).map((i) => {
          return i
        })}
        <Form.Field as='select' name='select2'>
          <option value='male'>Male</option>
          <option value='female'>Female</option>
          <option value='1d'>1d</option>
          <option value='czxc'>czxc</option>
          <option value='13f'>13f</option>
        </Form.Field>
        {store.get('select2')}

        <select>
          <option value='male'>Male</option>
          <option value='female'>Female</option>
          <option value='1d'>1d</option>
          <option value='czxc'>czxc</option>
          <option value='13f'>13f</option>
        </select>
      </Form.Item>
      <Form.Item label='Phone'>
        <Form.Field name='Phone' type='text' />
        {store.get('Phone')}
      </Form.Item>
      <Form.Item label='Address'>
        <Form.Field name='Address' type='text' />
        {store.get('Address')}
      </Form.Item>
      <Form.Item label=''>
        <button
          type='button'
          onClick={() => {
            console.log('===button click==')
          }}
        >
          Button
        </button>
        <button type='submit'>Submit</button>
        <button type='reset'>Reset</button>
      </Form.Item>
    </Form>
  )
}
```

### ComponentClass

```jsx
class App extends React.Component {
  state: {
    aaa: string,
    store: any,
  }
  store: FormStoreInstance
  constructor(props) {
    super(props)
    this.state = {
      aaa: '',
      store: {
        checkbox: 'checkbox1',
        username: 'Default',
        password: '',
        gender: 'male',
        contact: {
          phone: '',
          address: 'sdsdsd1',
          checkbox: [],
          radio: '',
        },
      },
    }
    this.store = new FormStore(
      this.state.store,
      (value) => {
        this.setState({
          store: value,
        })
      },
      {
        username: {
          fn(v) {
            // if (v === 'as') {
            //   return 'error这是一个错误'
            // }
            // return true
            return new Promise((resolve, reject) => {
              setTimeout(() => {
                if (v === 'as') {
                  reject('error这是一个错误')
                }
                //promise 验证方法, 必须明确结果, 不然验证会超时
                resolve()
              }, 1000)
            })
          },
        },
      }
    )
  }
  onReset = (e) => {
    console.log(JSON.stringify(this.store), 'reseted')
  }
  onSubmit = async (e) => {
    console.log(JSON.stringify(this.store), 'submited')
  }
  render() {
    // console.log(this.store, '======')
    const store = this.store
    const onSubmit = this.onSubmit.bind(this)
    const onReset = this.onReset.bind(this)
    return (
      <Form
        as='form'
        store={store}
        onSubmit={onSubmit}
        onReset={onReset}
        inline={boolean('Inline', false)}
        labelWidth={number('Label Width', 120)}
        labelAlign={select('labelAlign', ['left', 'right', 'center'], 'left')}
        gutter={number('Gutter', 20)}
      >
        <Form.Item
          required={boolean('RequiredName', true)}
          error={store.error('username')}
          label='username'
        >
          <Form.Field
            type='text'
            name='username'
            rule={{ fn: 'required' }}
            loadingAs='loading...'
          />
          {store.get('username')}
        </Form.Item>
        <Form.Item
          required={boolean('RequiredRadioCheckbox', false)}
          label='radio checkbox'
          error={store.error('radio')}
        >
          <div>
            <Form.Field type='radio' name='radio' value='radio1' />
            <Form.Field type='radio' name='radio' value='radio2' />
            {store.get('radio')}
          </div>
          <Form.Field type='checkbox' name='checkbox' value='checkbox1' />
          <Form.Field type='checkbox' name='checkbox' value='checkbox2' />
          <Form.Field type='checkbox' name='checkbox' value='checkbox3' />
          {(Array.isArray(store.get('checkbox'))
            ? store.get('checkbox')
            : [store.get('checkbox')]
          ).map((i) => {
            return i
          })}
        </Form.Item>
        <Form.Item label='Gender' error={store.error('contact.phone')}>
          <Form.Field as='select' multiple name='select'>
            <option value='male'>Male</option>
            <option value='female'>Female</option>
            <option value='1d'>1d</option>
            <option value='czxc'>czxc</option>
            <option value='13f'>13f</option>
          </Form.Field>
          {(store.get('select') || []).map((i) => {
            return i
          })}
          <Form.Field as='select' name='select2'>
            <option value='male'>Male</option>
            <option value='female'>Female</option>
            <option value='1d'>1d</option>
            <option value='czxc'>czxc</option>
            <option value='13f'>13f</option>
          </Form.Field>
          {store.get('select2')}

          <select>
            <option value='male'>Male</option>
            <option value='female'>Female</option>
            <option value='1d'>1d</option>
            <option value='czxc'>czxc</option>
            <option value='13f'>13f</option>
          </select>
        </Form.Item>
        <Form.Item label='Phone'>
          <Form.Field name='Phone' type='text' />
          {store.get('Phone')}
        </Form.Item>
        <Form.Item label='Address'>
          <Form.Field name='Address' type='text' />
          {store.get('Address')}
        </Form.Item>
        <Form.Item label=''>
          <button
            type='button'
            onClick={() => {
              console.log('===button click==')
            }}
          >
            Button
          </button>
          <button type='submit'>Submit</button>
          <button type='reset'>Reset</button>
        </Form.Item>
      </Form>
    )
  }
}
```

## APIs

#### `<Form>`

props
| name | type | default | description | required |
| ---| ---| ---| ---| ---|
| className | string | '' | class name | false |
| children | React.ReactNode | '' | children | false |
| store | FormStoreInstance | '' | store instance | true |
| as | `React.ComponentType<any> ; string ; React.ComponentType ; React.ForwardRefExoticComponent<any>` | 'form' | native element | false |

events
| name | type | default | description | required |
| ---| ---| ---| ---| ---|
| onSubmit | (e: React.FormEvent<HTMLFormElement>) => void | '' | submit | false |
| onReset | (e: React.FormEvent<HTMLFormElement>) => void | '' | reset | false |

---

##### `<FormItem>`

props
| name | type | default | description | required |
| ---| ---| ---| ---| ---|
| className | string | '' | class name | false |
| children | React.ReactNode | '' | children | false |
| label | string | '' | label | false |
| name | string | '' | name | false |
| required | boolean | '' | required | false |
| labelWidth | number | '' | label width | false |
| labelAlign | Property.TextAlign | '' | label align | false |
| error | any | '' | error | false |
| suffix | React.ReactNode | '' | error | false |

---

##### `<FormField>`

props
| name | type | default | description | required |
| ---| ---| ---| ---| ---|
| as | `'input' ; 'select' ; 'textarea'; FunctionComponent<P> ; ComponentClass<P> ; string` | 'input' | native element | false |
| children | React.ReactNode | '' | children | false |
| name | string | '' | name | true |
| valueKey | string | '' | valueKey | false |
| valueGetter | ValueGetter | '' | ValueGetter | false |
| loadingAs | `FunctionComponent<any> ; ComponentClass<any> ; string` | '' | loading native element | false |
| type | string | '' | type | false |
| value | any | '' | value | false |
| multiple | boolean | '' | multiple | false |
| rule | `Rule ; Rule[]` | '' | rule | false |
| validateTrigger | `'onChange' ; 'onBlur' ; string` | 'onChange' | validateTrigger | false |
| validateTrigger | `'onChange' ; 'onBlur' ; string` | 'onChange' | validateTrigger | false |

---

##### FormStoreConstructor

```typescript
interface FormStoreConstructor<T extends Object = any> {
  new (
    store: T,
    changed: React.Dispatch<React.SetStateAction<Partial<T>>>,
    rules?: Rules
  ): FormStoreInstance<T>
  validator: Record<string, ValidatorFn>
}
```

##### FormStoreInstance

```typescript
interface FormStoreInstance<T extends Object = any> {
  store: T
  changed: React.Dispatch<React.SetStateAction<Partial<T>>>
  rules: Rules
  initialValues: T
  names: Record<string, number>
  errors: Record<string, ValidResult>
  validStacks: Record<string, (Promise<ValidResult> | ValidResult)[]>
  validLoadings: Record<string, boolean>
  addName(name: string): void
  removeName(name: string): void
  addRule(name: string, newRule: Rule): void
  removeRule(name: string, newRule: Rule): void
  initStore(v: T): T
  reset(): void
  has(name: string): boolean
  get(name?: string): any | undefined
  unset(name: string): void
  set<V>(name: string, v?: V, refresh?: boolean): void
  refresh(): void
  setLoading(name: string): void
  unsetLoading(name: string): void
  isLoading(name: string): boolean
  validate: DebouncedFunc<
    (
      name?: string | undefined,
      refresh?: boolean | undefined,
      silent?: boolean | undefined
    ) => Promise<ValidResult>
  >
  setError(name: string, msg: string): void
  unsetError(name: string): void
  error(name: string): ValidResult
}
```

### [FormStoreConstructor.validator Inner Validator](./src/rules.ts)

- 'password' (v: string, othername: string, { data })
- 'required' (v: any, msg: string)
- 'email' (v: any, msg: string)
- 'ipv4' (v: any, msg: string)
- 'url' (v: any, msg: string)
- 'equals' (v: string, o: string)
- 'username' (v: any, msg: string)
- 'phone' (v: any, msg: string)
- 'cn' (v: any, msg: string)
