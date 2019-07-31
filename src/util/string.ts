export function padZero(value: number): string {
  return -1 < value && value < 10
    ? `0${value}`
    : `${value}`;
}
