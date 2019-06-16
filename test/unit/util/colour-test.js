import { hexToRGBA } from "../../../src/util/colour";

describe("util/colour", function() {

  it("returns null for non hex string", function() {
    assert.isNull(hexToRGBA("poop", "poop"));
    assert.isNull(hexToRGBA(null, null));
    assert.isNull(hexToRGBA(undefined, undefined));
    assert.isNull(hexToRGBA(123, 456));
  });

  it("does not take 3 digit hex", function() {
    assert.isNull(hexToRGBA("#000", 0.5));
  });

  it("returns null for invalid hex", function() {
    assert.isNull(hexToRGBA("#12312G", 0.5));
  });

  it("does not allow string alpha", function() {
    assert.isNull(hexToRGBA("#12312G", "0.5"));
  });

  it("converts valid hex to rgb", function() {
    assert.strictEqual(hexToRGBA("#000000", 1), "rgba(0, 0, 0, 1)");
    assert.strictEqual(hexToRGBA("#FFFFFF", 0), "rgba(255, 255, 255, 0)");
  });

});
