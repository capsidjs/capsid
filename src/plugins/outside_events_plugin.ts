import debugMessage from "../util/debug_message.ts";

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
            // TODO(kt3k): selectively inject __DEV__ variable
            const __DEV__ = true;
            if (__DEV__) {
              debugMessage({
                type: "event",
                module: "outside-events",
                color: "#39cccc",
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
