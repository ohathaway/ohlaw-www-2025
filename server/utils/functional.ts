export const pipe = <T>(...fns: Array<(value: T) => T>) =>
  (initialValue: T): T =>
    fns.reduce((value, fn) => fn(value), initialValue)
