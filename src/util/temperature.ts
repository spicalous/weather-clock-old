export function fahrenheitToCelsius(fahrenheit: number): number {
  return Math.round((5 / 9) * (fahrenheit - 32));
}
