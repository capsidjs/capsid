import capsidDebugMessage from '../debug-plugin'
import td from 'testdouble'

describe('debug-plugin', () => {
  afterEach(() => {
    td.reset()
  })

  describe('with event type message', () => {
    it('logs event and component names', () => {
      const e = { type: 'click' }
      const coelem = { constructor: { name: 'foo' } }

      td.replace(console, 'groupCollapsed')
      td.replace(console, 'log')
      td.replace(console, 'groupEnd')

      capsidDebugMessage({ type: 'event', e, coelem })

      td.verify(console.groupCollapsed(
        '%cclick %con %cfoo',
        'color: #f012be; font-weight: bold;',
        '',
        'color: #2ecc40; font-weight: bold;'
      ))
      td.verify(console.log(e))
      td.verify(console.groupEnd())
    })
  })

  describe('with outside event type message', () => {
    it('logs event and component names', () => {
      const e = { type: 'click' }
      const coelem = { constructor: { name: 'foo' } }

      td.replace(console, 'groupCollapsed')
      td.replace(console, 'log')
      td.replace(console, 'groupEnd')

      capsidDebugMessage({ type: 'outside-event', e, coelem })

      td.verify(console.groupCollapsed(
        '%coutside click %con %cfoo',
        'color: #39cccc; font-weight: bold;',
        '',
        'color: #2ecc40; font-weight: bold;'
      ))
      td.verify(console.log(e))
      td.verify(console.groupEnd())
    })
  })

  describe('with unknown typee message', () => {
    it('logs error message', () => {
      td.replace(console, 'log')

      capsidDebugMessage({ type: 'unknown' })

      td.verify(console.log(`Unknown message: ${JSON.stringify({ type: 'unknown' })}`))
    })
  })
})
