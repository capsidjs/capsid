import on from './on.js'
import useHandler from './on.use-handler.js'

on.useHandler = useHandler
on.useHandler('click')

export { on }
export { default as emits } from './emits.js'
export { default as wire, wired } from './wired.js'
export { default as component } from './component.js'
export { default as notifies } from './notifies.js'
