/**
 * Chunks array into multiple arrays by removing values when predicate is true
 *
 * @param {Array} arr
 * @param {Function} predicate
 */
export function chunkBy(array, predicate) {
  let result = [];
  let chunk;

  for (let i = 0; i < array.length; i++) {
    if (predicate(array[i])) {
      chunk = null;
    } else {
      if (!chunk) {
        chunk = [];
        result.push(chunk);
      }
      chunk.push(array[i]);
    }
  }

  return result;
}

/**
 * Split array into multiple arrays creating a new bucket when predicate is true
 *
 * @param {Array} arr
 * @param {Function} predicate
 */
export function splitBy(array, predicate) {
  let result = [];
  let chunk;

  for (let i = 0; i < array.length; i++) {
    if (predicate(array[i])) {
      chunk = null;
    }
    if (!chunk) {
      chunk = [];
      result.push(chunk);
    }
    chunk.push(array[i]);
  }

  return result;
}
