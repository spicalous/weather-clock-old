/**
 * @param {Array} arr
 */
export function splitAndChunkByNull(array) {
  let result = [];
  let temp;

  for (let i = 0; i < array.length; i++) {
    if (array[i] === null) {
      temp = null;
    } else {
      if (!temp) {
        temp = [];
        result.push(temp);
      }
      temp.push(array[i]);
    }
  }

  return result;
}
