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
        this.setState({
          store: value
        })
      },
      {
        'username': {
          fn (v) {
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
          }
        }
      }
    )
  }
  onReset = e => {
    console.log(JSON.stringify(this.store), 'reseted')
  }
  onSubmit = async e => {
    console.log(JSON.stringify(this.store), 'submited')
  };
  render () {
    // console.log(this.store, '======')
    return <div>
      <form onSubmit={(e) => { console.log(e); e.preventDefault() }} onReset={() => { console.log('==reset==') }}>
        <input type='text' value={this.state.aaa} onChange={(e) => {
          this.setState({
            aaa: e.target.value
          })
        }} />
        <input type='text' value={this.state.aaa} onChange={(e) => {
          this.setState({
            aaa: e.target.value
          })
        }} />
        <input type='text' value={this.state.aaa} onChange={(e) => {
          this.setState({
            aaa: e.target.value
          })
        }} />
        <button type="button" onClick={() => { console.log('=111===') }}>Rese111t</button>
        <button type="reset" onClick={() => { console.log('====') }}>Reset22</button>
      </form>
      {this.state.aaa}
      {render(this.store, this.onReset, this.onSubmit)}
    </div>
  }
}

storiesOf('Form', module).add('fields', () => {
  return <App />
})
