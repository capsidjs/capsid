export {
  assert,
  assertEquals,
  assertThrows,
} from "https://deno.land/std@0.119.0/testing/asserts.ts";
export { deferred } from "https://deno.land/std@0.119.0/async/deferred.ts";
import genel_ from "https://esm.sh/genel";
// import td from "https://esm.sh/testdouble";
import "https://unpkg.com/testdouble@3.16.3/dist/testdouble.js";
import * as capsid from "./mod.ts";
import "./dom_polyfill_deno.ts";
import { ready } from "./util/document.ts";

// deno-lint-ignore no-explicit-any
const genel = genel_ as any;
export { genel };
// deno-lint-ignore no-explicit-any
const td = (globalThis as any).td;
export { td };

export async function clearComponents() {
  await ready();
  Object.keys(capsid.__registry__).forEach((key) => {
    delete capsid.__registry__[key];
  });
}
