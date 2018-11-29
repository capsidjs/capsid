// @flow

import def from '../def.js'
import check from '../util/check.js'

/**
 * The decorator for class component registration.
 *
 * if `name` is function, then use it as class itself and the component name is kebab-cased version of its name.
 * @param name The class name or the implementation class itself
 * @return The decorator if the class name is given, undefined if the implementation class is given
 */
const component = (name: string): any => {
  check(
    typeof name === 'string' && !!name,
    'Component name must be a non-empty string'
  )

  return desc => {
    desc.finisher = Cls => {
      def(name, Cls)
    }
  }
}

export default component
