import { install } from '../index'
import debugPlugin from './debug-plugin'
import * as td from 'testdouble'

describe('debug-plugin', () => {
  beforeEach(() => {
    install(debugPlugin)
  })

  afterEach(() => {
    td.reset()
    delete (global as any).capsidDebugMessage
  })

  describe('with event type message', () => {
    it('logs event and component names', () => {
      const e = { type: 'click' }
      const coelem = { constructor: { name: 'foo' } }

      td.replace(console, 'groupCollapsed')
      td.replace(console, 'log')
      td.replace(console, 'groupEnd')
      ;(global as any).capsidDebugMessage({
        type: 'event',
        e,
        coelem,
        module: 'module'
      })

      td.verify(
        console.groupCollapsed(
          'module> %cclick%c on %cfoo',
          'color: #f012be; font-weight: bold;',
          '',
          'color: #1a80cc; font-weight: bold;'
        )
      )
      td.verify(console.log(e))
      td.verify(console.groupEnd())
    })
  })

  describe('with unknown typee message', () => {
    it('logs error message', () => {
      td.replace(console, 'log')
      ;(global as any).capsidDebugMessage({ type: 'unknown' })

      td.verify(
        console.log(`Unknown message: ${JSON.stringify({ type: 'unknown' })}`)
      )
    })
  })
})
