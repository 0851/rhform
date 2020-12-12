import React from 'react'
import { storiesOf } from '@storybook/react'
import { FormStore, FormStoreInstance } from '../../src/index'
import { render } from './render'

function assert (condition: any, message?: string) {
  if (!condition) throw new Error(message)
}

class App extends React.Component {
  state: {
    aaa: string,
    store: any
  }
  store: FormStoreInstance
  constructor (props) {
    super(props);
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
        }
      }
    }
    this.store = new FormStore(
      this.state.store,
      (value) => {
        // console.log(value)
        this.setState({
          store: value
        })
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
        }
      }
    )
  }
  onReset = e => {
    e.preventDefault();
    this.store.reset()
  }
  onSubmit = async e => {
    e.preventDefault();
    try {
      const values = await this.store.validate()
      console.log('values:', values)
    } catch (error) {
      console.log('error:', error)
    }
  };
  render () {
    return <div>
      <input type='text' value={this.state.aaa} onChange={(e) => {
        this.setState({
          aaa: e.target.value
        })
      }} />
      {this.state.aaa}
      {render(this.store, this.onReset, this.onSubmit)}
    </div>
  }
}

storiesOf('Form', module).add('fields', () => {
  return <App />
})
