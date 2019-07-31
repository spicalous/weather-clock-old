type ChunkPredicateFn<T, ChunkBy> = (value: T | ChunkBy) => value is ChunkBy;

/**
 * Chunks array into multiple arrays by removing values when predicate is true
 */
export function chunkBy<T, ChunkBy>(array: (T | ChunkBy)[], predicate: ChunkPredicateFn<T, ChunkBy>): T[][] {
  const result: T[][] = [];
  let chunk: T[] | null = null;

  for (let i = 0; i < array.length; i++) {
    const value = array[i];
    if (predicate(value)) {
      chunk = null;
    } else {
      if (!chunk) {
        chunk = [];
        result.push(chunk);
      }
      chunk.push(value);
    }
  }

  return result;
}

type PredicateFn<T> = (value: T) => boolean;

/**
 * Split array into multiple arrays creating a new bucket when predicate is true
 */
export function splitBy<T>(array: T[], predicate: PredicateFn<T>): T[][] {
  const result: T[][] = [];
  let chunk: T[] | null = null;

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
