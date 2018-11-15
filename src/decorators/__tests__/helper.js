export const callClassDecorator = (classDecorator, constructor) => {
  let descriptor = {
    kind: 'class',
    elements: [] // TODO: fill
  }

  descriptor = classDecorator(descriptor) || descriptor

  if (!descriptor.finisher) {
    return constructor
  }

  return descriptor.finisher.call(null, constructor) || constructor
}

export const callMethodDecorator = (methodDecorator, constructor, key) => {
  let descriptor = {
    kind: 'method',
    key,
    placement: 'prototype',
    descriptor: Object.getOwnPropertyDescriptor(constructor.prototype, key)
  }

  descriptor = methodDecorator(descriptor) || descriptor

  if (descriptor.descriptor) {
    Object.defineProperty(constructor.prototype, key, descriptor.descriptor)
  }

  if (!descriptor.finisher) {
    return
  }

  descriptor.finisher.call(null, constructor)
}

export const callFieldDecorator = (fieldDecorator, constructor, key) => {
  let descriptor = {
    kind: 'field',
    key,
    placement: 'own'
  }

  descriptor = fieldDecorator(descriptor) || descriptor

  if (!descriptor.finisher) {
    return
  }

  descriptor.finisher.call(null, constructor)
}
