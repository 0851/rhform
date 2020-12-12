import { boolean, number, select } from '@storybook/addon-knobs'
import { Form, FormStoreInstance } from '../../src/index'
import React from 'react'
export function render (store: FormStoreInstance, onReset?: any, onSubmit?: any) {
  return <Form
    as="form"
    store={store}
    inline={boolean('Inline', false)}
    labelWidth={number('Label Width', 120)}
    labelAlign={select('labelAlign', ['left', 'right', 'center'], 'left')}
    gutter={number('Gutter', 20)}
  >
    <Form.Item
      required={boolean('RequiredName', true)}
      error={store.error('contact.phone')}
      label='username'
    >
      <Form.Field type='text' name="contact.phone" rule={{ fn: 'required' }} />
      {store.get('contact.phone')}
    </Form.Item>
    <Form.Item required={boolean('RequiredRadioCheckbox', false)} label='radio checkbox'
      error={store.error('radio')}>
      <div>
        <Form.Field type='radio' name="radio" value="radio1" />
        <Form.Field type='radio' name="radio" value="radio2" />
        {store.get('radio')}
      </div>
      <Form.Field type='checkbox' name="checkbox" value="checkbox1" />
      <Form.Field type='checkbox' name="checkbox" value="checkbox2" />
      <Form.Field type='checkbox' name="checkbox" value="checkbox3" />
      {(Array.isArray(store.get('checkbox')) ? store.get('checkbox') : [store.get('checkbox')]).map((i) => {
        return i
      })}
    </Form.Item>
    <Form.Item label='Gender'
      error={store.error('contact.phone')}
    >
      <Form.Field as="select" multiple name="select">
        <option value='male'>Male</option>
        <option value='female'>Female</option>
        <option value='1d'>1d</option>
        <option value='czxc'>czxc</option>
        <option value='13f'>13f</option>
      </Form.Field>
      {(store.get('select') || []).map((i) => {
        return i
      })}
      <Form.Field as="select" name="select2">
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
      <Form.Field name="Phone" type='text' />
      {store.get('Phone')}
    </Form.Item>
    <Form.Item label='Address'>
      <Form.Field name="Address" type='text' />
      {store.get('Address')}
    </Form.Item>
    <Form.Item label=''>
      <button onClick={onReset}>Reset</button>
      <button onClick={onSubmit}>Submit</button>
    </Form.Item>
  </Form>
}