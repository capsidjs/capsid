import * as capsid from './index'
;(global as any).__DEV__ = true

export const clearComponents = () =>
  Object.keys(capsid.__registry__).forEach((key) => {
    delete capsid.__registry__[key]
  })
