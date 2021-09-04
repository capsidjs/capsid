import def from "./def";
import prep from "./prep";
import make from "./make";
import mount from "./mount";
import unmount from "./unmount";
import get from "./get";
import install from "./install";
import { addMountHook } from "./add-hidden-item";
import {
  component,
  emits,
  innerHTML,
  is,
  on,
  pub,
  sub,
  wired,
} from "./decorators/index";
import __registry__ from "./registry";

export {
  __registry__,
  addMountHook,
  component,
  def,
  emits,
  get,
  innerHTML,
  install,
  is,
  make,
  mount,
  on,
  prep,
  pub,
  sub,
  unmount,
  wired,
};
