export const PrecipitationIntensity = Object.freeze({
  LIGHT: 0,    // rate is < 2.5 mm (0.098 in) per hour
  MODERATE: 1, // rate is between  2.5 mm (0.098 in) and 10 mm (0.392 in) per hour
  HEAVY: 2,    // rate is between 10.0 mm (0.392 in) and 50 mm (2.000 in) per hour
  VIOLENT: 3   // rate is > 50.0 mm (2.000 in) per hour
});

/**
 * @param {number} precipitationIntensity
 */
export function inchesToPrecipitationIntensity(precipitationIntensity) {

  if (precipitationIntensity < 0.098) {
    return PrecipitationIntensity.LIGHT;
  }

  if (0.098 <= precipitationIntensity && precipitationIntensity < 0.392) {
    return PrecipitationIntensity.MODERATE;
  }

  if (0.392 <= precipitationIntensity && precipitationIntensity < 2) {
    return PrecipitationIntensity.HEAVY;
  }

  return PrecipitationIntensity.VIOLENT;
}
