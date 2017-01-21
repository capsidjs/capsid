// @flow

import def from '../def.js'
import camelToKebab from '../util/camel-to-kebab.js'

/**
 * The decorator for class component registration.
 *
 * if `name` is function, then use it as class itself and the component name is kebabized version of its name.
 * @param name The class name or the implementation class itself
 * @return The decorator if the class name is given, undefined if the implementation class is given
 */
const component = (name: string | Function): any => {
  if (typeof name !== 'function') {
    return Cls => {
      def((name: any), Cls)
      return Cls
    }
  }

  return component(camelToKebab(name.name))(name)
}

export default component
