import React from 'react'
import { FormOptions, FormStoreInstance } from './types'
export const FormStoreContext = React.createContext<{ store?: FormStoreInstance, opts?: FormOptions }>({})
