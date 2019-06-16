import { padZero } from "../../../src/util/string";

describe("util/string", function() {

  it("does not pad for negative numbers", function() {
    assert.strictEqual(padZero(-1), "-1");
    assert.strictEqual(padZero("-1"), "-1");
  });

  it("pads single digit numbers", function() {
    assert.strictEqual(padZero(0), "00");
    assert.strictEqual(padZero(9), "09");
    assert.strictEqual(padZero("0"), "00");
  });

  it("does not pad two digit numbers", function() {
    assert.strictEqual(padZero(10), "10");
    assert.strictEqual(padZero(99), "99");
    assert.strictEqual(padZero(100), "100");
  });

});
