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
