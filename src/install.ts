import * as capsid from "./index.ts";
import check from "./util/check.ts";

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
export default (capsidModule: CapsidModule, options?: object) => {
  check(
    typeof capsidModule.install === "function",
    "The given capsid module does not have `install` method. Please check the install call.",
  );

  capsidModule.install(capsid, options || {});
};
