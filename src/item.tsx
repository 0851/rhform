import React, { useContext } from 'react'
import { defaultTo } from './lodash'
import { FormStoreContext } from './custom-context'
import { FormItemProps } from './types'


export function FormItem (props: FormItemProps) {
  const {
    className,
    label,
    error,
    required,
    suffix,
    children,
    ...restProps
  } = props

  const { opts: options = {} } = useContext(FormStoreContext)

  const {
    inline,
    labelWidth,
    gutter,
    componentName = 'rhform',
    labelAlign = 'right',
    errorClassName = undefined,
    ...otherProps
  } = {
    ...options,
    ...restProps
  }

  let child: any = children

  const name = `${componentName}-field`

  const classes = {
    field: name,
    inline: `${name}--inline`,
    required: `${name}--required`,
    error: `${name}--error`,
    label: `${name}__label`,
    container: `${name}__container`,
    control: `${name}__control`,
    message: `${name}__message`,
    footer: `${name}__footer`,
  }

  const classNames = [
    classes.field,
    inline ? classes.inline : '',
    required ? classes.required : '',
    error ? classes.error : '',
    error && errorClassName ? errorClassName : '',
    className ? className : ''
  ].filter(n => !!n).join(' ')

  const labelStyle = {
    width: defaultTo(labelWidth, 120),
    textAlign: labelAlign,
    marginRight: defaultTo(gutter, 20),
  }

  const containerStyle = {
    marginLeft: !!label ? defaultTo(labelWidth, 120) + defaultTo(gutter, 20) : undefined
  }

  return (
    <div className={classNames} {...otherProps}>
      {!!label && (
        <div className={classes.label} style={labelStyle}>
          {label}
        </div>
      )}
      <div className={classes.container} style={containerStyle}>
        <div className={classes.control}>{child}</div>
        {!!error ? <div className={classes.message}>{error}</div> : undefined}
      </div>
      {!!suffix && <div className={classes.footer}>{suffix}</div>}
    </div>
  )
}
