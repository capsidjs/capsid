import def from "./def.ts";
import prep from "./prep.ts";
import make from "./make.ts";
import mount from "./mount.ts";
import unmount from "./unmount.ts";
import get from "./get.ts";
import { addMountHook } from "./add_hidden_item.ts";
import {
  component,
  emits,
  innerHTML,
  is,
  on,
  pub,
  sub,
  wired,
} from "./decorators/index.ts";
import check from "./util/check.ts";
import __registry__ from "./registry.ts";

interface CapsidModule {
  // deno-lint-ignore ban-types
  install: Function;
}

/**
 * Installs the capsid module or plugin.
 *
 * @param capsidModule
 * @param options
 */
// deno-lint-ignore ban-types
const install = (capsidModule: CapsidModule, options?: object) => {
  check(
    typeof capsidModule.install === "function",
    "The given capsid module does not have `install` method. Please check the install call.",
  );

  capsidModule.install({
    def,
    prep,
    make,
    mount,
    unmount,
    get,
    install,
    addMountHook,
    component,
    emits,
    innerHTML,
    is,
    on,
    pub,
    sub,
    wired,
    __registry__,
  }, options || {});
};

export default install;
