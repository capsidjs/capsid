// @flow

const capsid = require('../')
const assert = require('assert')

describe('install', () => {
  it('calls install method of the given module', done => {
    const options = { foo: 'bar' }

    capsid.install({ install (capsidObj, options) {
      assert.deepStrictEqual(capsidObj, capsid)
      assert.strictEqual(options, options)

      done()
    } }, options)
  })

  it('throws when the given module does not have the install method', () => {
    assert.throws(() => {
      capsid.install(({}: any))
    }, /The given capsid module does not have `install` method. Please check the install call./)
  })
})
