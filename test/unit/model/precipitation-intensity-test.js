import { PrecipitationIntensity, inchesToPrecipitationIntensity } from "../../../src/model/precipitation-intensity";

describe("model/precipitation-intensity", function() {

  it("inches to precipitation intensity", function() {
    assert.strictEqual(inchesToPrecipitationIntensity(0), PrecipitationIntensity.LIGHT);
    assert.strictEqual(inchesToPrecipitationIntensity(0.097), PrecipitationIntensity.LIGHT);
    assert.strictEqual(inchesToPrecipitationIntensity(0.098), PrecipitationIntensity.MODERATE);
    assert.strictEqual(inchesToPrecipitationIntensity(0.391), PrecipitationIntensity.MODERATE);
    assert.strictEqual(inchesToPrecipitationIntensity(0.392), PrecipitationIntensity.HEAVY);
    assert.strictEqual(inchesToPrecipitationIntensity(1.999), PrecipitationIntensity.HEAVY);
    assert.strictEqual(inchesToPrecipitationIntensity(2), PrecipitationIntensity.VIOLENT);
  });

});
