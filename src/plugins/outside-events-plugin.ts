import debugMessage from '../util/debug-message'

declare var __DEV__: boolean

const install = (capsid: any) => {
  const { on, addMountHook } = capsid

  on.outside = (event: string) => (target: any, key: string, _: any) => {
    addMountHook(target.constructor, (el: HTMLElement, coel: any) => {
      const listener = (e: Event): void => {
        if (el !== e.target && !el.contains(e.target as any)) {
          if (__DEV__) {
            debugMessage({
              type: 'event',
              module: 'outside-events',
              color: '#39cccc',
              el,
              e,
              coel
            })
          }

          coel[key](e)
        }
      }

      document.addEventListener(event, listener)
    })
  }
}

export default { install }
