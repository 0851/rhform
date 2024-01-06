import { ValidatorFn } from './types'
import { isString, lodashGet, isEmpty } from './lodash'
/**
 * TODO 自带验证器补充
 */
export const validator: Record<string, ValidatorFn> = {
  'password' (v: string, othername: string, { data }) {
    if (isString(v) && isString(othername)) {
      return v === lodashGet(data, othername)
    }
    return `请设置相同密码`
  },
  'required' (v: any, msg: string) {
    return !isEmpty(v) ? true : (msg || '必填')
  },
  'email' (v: any, msg: string) {
    return isString(v) && /^([A-Za-z0-9\_\-\.])+@([A-Za-z0-9\_\-\.])+\.([A-Za-z]{2,4})$/.test(v) ? true : (msg || '请输入正确的Email')
  },
  'ipv4' (v: any, msg: string) {
    return isString(v) && /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?).){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(v) ? true : (msg || '不符合规范的IPV4地址')
  },
  'url' (v: any, msg: string) {
    return isString(v) && /^((https?|ftp|file):\/\/)?([da-z.-]+).([a-z.]{2,6})([/w .-]*)*\/?$/.test(v) ? true : (msg || '不符合规范的url')
  },
  'equals' (v: string, o: string) {
    return v === o ? true : `${v}与${o}不相等`
  },
  'username' (v: any, msg: string) {
    return isString(v) && /^[a-zA-Z0-9_-]{4,16}$/.test(v) ? true : (msg || '用户名正则，4到16位（字母，数字，_，-）')
  },
  'phone' (v: any, msg: string) {
    return isString(v) && /^1[3456789]d{9}$/.test(v) ? true : (msg || '请输入手机号')
  },
  'cn' (v: any, msg: string) {
    return isString(v) && /^([u4E00-u9FA5])+$/.test(v) ? true : (msg || '请输入中文')
  }
}