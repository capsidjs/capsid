import camelToKebab from '../../src/util/camel-to-kebab'

const assert = require('assert')

describe('camelToKebab', () => {
  it('convert camel case to kebab case', () => {
    assert(camelToKebab('camelToKebab') === 'camel-to-kebab')
    assert(camelToKebab('CamelToKebab') === 'camel-to-kebab')
  })
})
