import debugMessage from '../util/debug_message.ts';

declare let __DEV__: boolean;

// deno-lint-ignore no-explicit-any
const install = (capsid: any) => {
  const { on, addMountHook } = capsid;

  on.outside = (event: string) =>
    // deno-lint-ignore no-explicit-any
    (target: any, key: string, _: any) => {
      // deno-lint-ignore no-explicit-any
      addMountHook(target.constructor, (el: HTMLElement, coel: any) => {
        const listener = (e: Event): void => {
          // deno-lint-ignore no-explicit-any
          if (el !== e.target && !el.contains(e.target as any)) {
            if (__DEV__) {
              debugMessage({
                type: 'event',
                module: 'outside-events',
                color: '#39cccc',
                el,
                e,
                coel,
              });
            }

            coel[key](e);
          }
        };

        document.addEventListener(event, listener);
      });
    };
};

export default { install };
