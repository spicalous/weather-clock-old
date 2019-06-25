import { fahrenheitToCelsius } from "../../../src/util/temperature";

describe("util/temperature", function() {

  it("converts null to celsius", function() {
    assert.strictEqual(fahrenheitToCelsius(null), -18);
  });

  it("rounds temperature to 1 decimal place", function() {
    assert.strictEqual(fahrenheitToCelsius(0), -18);
    assert.strictEqual(fahrenheitToCelsius(1), -17);
    assert.strictEqual(fahrenheitToCelsius(2), -17);
    assert.strictEqual(fahrenheitToCelsius(3), -16);
    assert.strictEqual(fahrenheitToCelsius(4), -16);
    assert.strictEqual(fahrenheitToCelsius(5), -15);
    assert.strictEqual(fahrenheitToCelsius(32), 0);
    assert.strictEqual(fahrenheitToCelsius(212), 100);
  });

});
