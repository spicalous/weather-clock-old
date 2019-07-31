import { chunkBy, splitBy } from "../../../src/util/array";
import { isNull } from "../../../src/util/object";

describe("util/array", function() {

  it("returns empty array for empty array", function() {
    assert.deepEqual(chunkBy([], () => true), []);
    assert.deepEqual(chunkBy([], () => false), []);
    assert.deepEqual(splitBy([], () => true), []);
    assert.deepEqual(splitBy([], () => false), []);
  });

  it("chunks the array by predicate", function() {
    assert.deepEqual(chunkBy([1, 2, null, 3, null, null, 4], isNull), [[1, 2], [3], [4]]);
    assert.deepEqual(chunkBy([null, 1, 2, null, 3, null, null, 4, null], isNull), [[1, 2], [3], [4]]);
  });

  it("splits the array by predicate", function() {
    assert.deepEqual(splitBy([1, 2, null, 3, null, null, 4], isNull), [[1, 2], [null, 3], [null], [null, 4]]);
    assert.deepEqual(splitBy([null, 1, 2, null, 3, null, null, 4, null], isNull), [[null, 1, 2], [null, 3], [null], [null, 4], [null]]);
  });

});
