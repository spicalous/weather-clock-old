/**
 * @param {number} number
 */
export function padZero(number) {
  return -1 < number && number < 10
    ? `0${number}`
    : `${number}`;
}
