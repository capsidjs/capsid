const camelToKebab = require('../src/camel-to-kebab').default

const assert = require('power-assert')

describe('camelToKebab', () => {
  it('convert camel case to kebab case', () => {
    assert(camelToKebab('camelToKebab') === 'camel-to-kebab')
    assert(camelToKebab('CamelToKebab') === 'camel-to-kebab')
  })
})
