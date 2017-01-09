// @flow
import createComponentInitializer from './create-component-initializer.js'
import check from './util/check.js'
import { ready } from './util/document'
import ccc from './ccc.js'
import init from './init.js'

/**
 * Registers the class-component for the given name and constructor and returns the constructor.
 * @param name The component name
 * @param Constructor The constructor of the class component
 * @return The registered component class
 */
const def: any = (name: string, Constructor: Function): Function => {
  check(typeof name === 'string', '`name` of a class component has to be a string.')
  check(typeof Constructor === 'function', '`Constructor` of a class component has to be a function')

  ccc[name] = createComponentInitializer(name, Constructor)

  ready(() => { init(name) })

  return Constructor
}

export default def
