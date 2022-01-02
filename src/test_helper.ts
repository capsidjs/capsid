export {
  assert,
  assertEquals,
  assertThrows,
} from "https://deno.land/std@0.119.0/testing/asserts.ts";
export { deferred } from "https://deno.land/std@0.119.0/async/deferred.ts";
import genel_ from "https://esm.sh/genel";
// import td from "https://esm.sh/testdouble";
import "https://unpkg.com/testdouble@3.16.3/dist/testdouble.js";
import { DOMParser } from "https://raw.githubusercontent.com/b-fuze/deno-dom/9e4814e8d8117d8410fabb726d118e144e49fbf3/deno-dom-wasm.ts";
import * as capsid from "./mod.ts";

// deno-lint-ignore no-explicit-any
const genel = genel_ as any;
export { genel };
// deno-lint-ignore no-explicit-any
const td = (globalThis as any).td;
export { td };
// export { td };
// deno-lint-ignore no-explicit-any
(globalThis as any).__DEV__ = true;

export const clearComponents = () =>
  Object.keys(capsid.__registry__).forEach((key) => {
    delete capsid.__registry__[key];
  });
// deno-lint-ignore no-explicit-any
(globalThis as any).document = new DOMParser().parseFromString(
  "<body></body>",
  "text/html",
);
