// @flow
import outsideEventsPlugin from '../outside-events-plugin.js'
import { on, mount, pluginHooks } from '../../index.js'
  ;(outsideEventsPlugin: any)({ on, pluginHooks })

describe('outside-events-plugin', () => {
  describe('on.outside', () => {
    it('add outside event handler', done => {
      class Component {
        @on.outside('click')
        handleOutsideClick () {
          done()
        }
      }

      const div = document.createElement('div')

      mount(Component, div)

      if (document.body) document.body.click()
    })
  })
})
