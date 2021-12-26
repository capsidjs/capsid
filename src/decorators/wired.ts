/**
 * Wires the element of the given selector to the property.
 *
 *     class A {
 *       @wired('input') input: HTMLInputElement
 *
 *       @on.click
 *       onClick() {
 *         axios.post('my-api', { value: this.input.value })
 *       }
 *     }
 */
const wired = (sel: string) =>
  // deno-lint-ignore no-explicit-any
  (_target: any, _key: string): any => {
    return {
      get: function () {
        return this.el.querySelector(sel);
      },
      configurable: false,
    };
  };

/**
 * Wires all the elements to the property.
 *
 *     class A {
 *       @wired.all('li') items: HTMLElement
 *
 *       @on.click
 *       doEffect() {
 *         this.items.forEach(li => {
 *           li.classList.add('effect')
 *         })
 *       }
 *     }
 */
const wiredAll = (sel: string) =>
  // deno-lint-ignore no-explicit-any
  (_target: any, _key: string): any => {
    return {
      get() {
        return this.el.querySelectorAll(sel);
      },
    };
  };

wired.all = wiredAll;

export default wired;
