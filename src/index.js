// @flow

import def from "./def.js";
import prep from "./prep.js";
import make from "./make.js";
import mount from "./mount.js";
import get from "./get.js";
import { on, emits, wire, component, notifies } from "./decorators/index.js";
import __ccc__ from "./ccc.js";
import pluginHooks from "./plugin-hooks.js";

const emit = emits; // alias
const pub = notifies; // alias

export {
  def,
  prep,
  make,
  mount,
  get,
  on,
  emit,
  emits,
  wire,
  component,
  pub,
  notifies,
  __ccc__,
  pluginHooks
};
