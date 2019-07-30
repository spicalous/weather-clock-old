export function isObject(data: unknown): data is object {
  return typeof data === "object";
}

export function isDefined<T>(value: T | null | undefined): value is T {
  return value !== null && value !== undefined;
}
