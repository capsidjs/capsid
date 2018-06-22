import onClick from './on.click.js'
import onClickAt from './on.click.at.js'
import on from './on.js'

on.click = onClick
on.click.at = onClickAt

export { on }
export { default as emits } from './emits.js'
export { default as wire, wired } from './wired.js'
export { default as component } from './component.js'
export { default as notifies } from './notifies.js'
