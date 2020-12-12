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

```typescript

```

### ComponentClass

```typescript

```

## APIs
