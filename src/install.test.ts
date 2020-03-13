import * as capsid from './index'
import * as assert from 'assert'

describe('install', () => {
  it('calls install method of the given module', done => {
    const options = { foo: 'bar' }

    capsid.install(
      {
        install(capsidObj: unknown, options0: unknown) {
          assert.deepStrictEqual(capsidObj, capsid)
          assert.strictEqual(options0, options)

          done()
        }
      },
      options
    )
  })

  it('throws when the given module does not have the install method', () => {
    assert.throws(() => {
      capsid.install({} as any)
    }, /The given capsid module does not have `install` method. Please check the install call./)
  })
})
