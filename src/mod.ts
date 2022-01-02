import def from './def.ts';
import prep from './prep.ts';
import make from './make.ts';
import mount from './mount.ts';
import unmount from './unmount.ts';
import get from './get.ts';
import install from './install.ts';
import { addMountHook } from './add_hidden_item.ts';
import {
  component,
  emits,
  innerHTML,
  is,
  on,
  pub,
  sub,
  wired,
} from './decorators/index.ts';
import __registry__ from './registry.ts';

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
