# rhform

> A form component. [inspiration](https://github.com/varHarrie/react-hero-form)

[中文](./README.zh-CN.md)

## Installation

```bash
npm install rhform --save
# or
yarn add rhform
```

## Reset

```typescript
const store = new FormStore({ name: 'test' })
store.reset()
```

## Validation

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

```typescript

```

### ComponentClass

```typescript

```

## APIs
