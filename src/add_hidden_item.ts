import { BEFORE_MOUNT_KEY } from './util/const.ts';

// deno-lint-ignore no-explicit-any
const addHiddenItem = (target: any, key: string, hook: unknown) => {
  target[key] = (target[key] || []).concat(hook);
};

// deno-lint-ignore no-explicit-any
export const addMountHook = (target: any, hook: unknown) => {
  addHiddenItem(target, BEFORE_MOUNT_KEY, hook);
};

export default addHiddenItem;
