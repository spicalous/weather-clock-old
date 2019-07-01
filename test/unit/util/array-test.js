import { splitAndChunkByNull } from "../../../src/util/array";

describe("util/array", function() {

  it("returns empty array for empty array", function() {
    assert.deepEqual(splitAndChunkByNull([]), []);
  });

  it("chunks the array by nulls", function() {
    assert.deepEqual(splitAndChunkByNull([1, 2, null, 3, null, null, 4]), [[1, 2], [3], [4]]);
    assert.deepEqual(splitAndChunkByNull([null, 1, 2, null, 3, null, null, 4, null]), [[1, 2], [3], [4]]);
  });

});
