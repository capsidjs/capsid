import { callDecorator } from '../../__tests__/helper.js'
import outsideEventsPlugin from '../outside-events-plugin.js'
import { on, mount, pluginHooks } from '../../index.js'

outsideEventsPlugin({ on, pluginHooks })

describe('outside-events-plugin', () => {
  describe('on.outside', () => {
    it('add outside event handler', done => {
      class Component {
        handleOutsideClick () {
          done()
        }
      }

      callDecorator(on.outside('click'), Component, 'handleOutsideClick')

      const div = document.createElement('div')

      mount(Component, div)

      document.body.click()
    })
  })
})
