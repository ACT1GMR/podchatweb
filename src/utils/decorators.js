export function promiseDecorator(target, name, descriptor) {
  const original = descriptor.value;
  descriptor.value = function (...args) {
    return new Promise((resolve, reject) => {
      original.apply(this, [resolve, reject, ...args]);
    });
  };
  return descriptor;
}