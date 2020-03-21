import on from './on'
import useHandler from './on.use-handler'

on.useHandler = useHandler
on.useHandler('click')

export { on }
export { default as emits } from './emits'
export { default as wired } from './wired'
export { default as component } from './component'
export { default as is } from './is'
export { default as innerHTML } from './inner-html'
export { default as pub } from './pub'
export { default as sub } from './sub'
