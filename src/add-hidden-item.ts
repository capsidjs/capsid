import { BEFORE_MOUNT_KEY } from './util/const'

const addHiddenItem = (target: any, key: string, hook: unknown) => {
  target[key] = (target[key] || []).concat(hook)
}

export const addMountHook = (target: any, hook: unknown) => {
  addHiddenItem(target, BEFORE_MOUNT_KEY, hook)
}

export default addHiddenItem
