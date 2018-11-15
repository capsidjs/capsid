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

export const callMethodDecorator = (methodDecorator, key, constructor) => {
  let descriptor = {
    kind: 'method',
    key,
    placement: 'prototype',
    descriptor: Object.getOwnPropertyDescriptor(constructor.prototype, key)
  }

  descriptor = methodDecorator(descriptor) || descriptor

  if (!descriptor.finisher) {
    return
  }

  descriptor.finisher.call(null, constructor) || constructor
}

export const callFieldDecorator = (fieldDecorator, key, constructor) => {
  let descriptor = {
    kind: 'field',
    key,
    placement: 'own'
  }

  descriptor = fieldDecorator(descriptor) || descriptor

  if (!descriptor.finisher) {
    return
  }

  descriptor.finisher.call(null, constructor) || constructor
}
