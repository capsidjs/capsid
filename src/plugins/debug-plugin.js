// @flow

import { COMPONENT_NAME_KEY } from '../util/const'

export default (message: Object) => {
  switch (message.type) {
    case 'event':
      onEventMessage(message)
      break
    default:
      console.log(`Unknown message: ${JSON.stringify(message)}`)
  }
}

const onEventMessage = ({ el, coelem, e }: { el: HTMLElement, coelem: any, e: Event }) => {
  const { constructor } = coelem
  const event = `${e.type}`
  const component = `${constructor[COMPONENT_NAME_KEY] || constructor.name}`

  const eventStyle = 'color: magenta; font-weight: bold;'
  const componentStyle = 'color: green; font-weight: bold;'

  console.groupCollapsed(`%c${event} %con %c${component}`, eventStyle, '', componentStyle)
  console.log(e)
  console.groupEnd()
}
