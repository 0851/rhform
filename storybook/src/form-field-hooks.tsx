import React from 'react'
import { storiesOf } from '@storybook/react'
import { useFormStore } from '../../src/index'
import { render } from './render'
function assert (condition: any, message?: string) {
  if (!condition) throw new Error(message)
}

function App () {
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
      }
    },
    {
      'contact.phone': {
        fn (v) {
          return new Promise((resolve, reject) => {
            setTimeout(() => {
              if (v === 'as') {
                reject('error这是一个错误')
              }
              //promise 验证方法, 必须明确结果, 不然验证会超时
              resolve()
            }, 1000)
          })
        }
      },
      'radio': {
        fn (v) {
          if (v === 'radio1') {
            return '错误'
          }
        }
      }
    }
  )

  const onReset = React.useCallback((e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault()
    // console.log(store)
    store.reset()
  }, [])

  const onSubmit = React.useCallback(async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault()
    try {
      const values = await store.validate()
      console.log('values:', values)
    } catch (error) {
      console.log('error:', error)
    }
  }, [])

  return (
    render(store, onReset, onSubmit)
  )
}

storiesOf('Form', module).add('fields with hooks', () => {
  return <App />
})
