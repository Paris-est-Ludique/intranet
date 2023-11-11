export function pick<T extends object, K extends keyof T>(obj: T, ...keys: K[]) {
  return Object.fromEntries(keys.filter(key => key in obj).map(key => [key, obj[key]])) as Pick<T, K>
}

export function inclusivePick<T extends object, K extends string | number | symbol>(obj: T, ...keys: K[]) {
  return Object.fromEntries(keys.map(key => [key, obj[key as unknown as keyof T]])) as {
    [key in K]: key extends keyof T ? T[key] : undefined
  }
}

export function omit<T extends object, K extends keyof T>(obj: T, ...keys: K[]) {
  return Object.fromEntries(Object.entries(obj).filter(([key]) => !keys.includes(key as K))) as Omit<T, K>
}
