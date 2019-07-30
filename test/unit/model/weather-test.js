import { Time } from "../../../src/model/time";
import Weather from "../../../src/model/weather";

describe("model/weather", function() {

  it("returns passed in timezone", function() {
    const weather = new Weather("TIMEZONE", [], []);
    assert.strictEqual(weather.getTimezone(), "TIMEZONE");
  });

  it("returns empty data if no temperature", function() {
    const weather = new Weather("", [], []);
    assert.deepEqual(weather.getTemperatureData(0, 1), { data: [], min: Infinity, max: -Infinity });
  });

  it("returns temperature data based on start/end time", function() {
    const weather = new Weather("", [
      { time: 0, temperature: 0 },
      { time: 1, temperature: 1 },
      { time: 2, temperature: 2 },
      { time: 3, temperature: 3 },
      { time: 4, temperature: 4 },
      { time: 5, temperature: 5 }
    ], []);

    assert.deepEqual(weather.getTemperatureData(1, 4), {
      data: [
        { time: 2, temperature: 2 },
        { time: 3, temperature: 3 },
        { time: 4, temperature: 4 }
      ],
      min: 2,
      max: 4
    });
  });

  it("returns precipitation data based on start/end time", function() {
    const weather = new Weather("", [
      { time: 0, precipProbability: 0.0, precipIntensity: 1 },
      { time: 1, precipProbability: 0.1, precipIntensity: 1 },
      { time: 2, precipProbability: 0.2, precipIntensity: 1 },
      { time: 3, precipProbability: 0.3, precipIntensity: 1 },
      { time: 4, precipProbability: 0.4, precipIntensity: 1 },
      { time: 5, precipProbability: 0.5, precipIntensity: 1 },
      { time: 6, precipProbability: 0.6, precipIntensity: 1 },
      { time: 7, precipProbability: 0.7, precipIntensity: 1 },
      { time: 8, precipProbability: 0.8, precipIntensity: 1 },
      { time: 9, precipProbability: 0.9, precipIntensity: 1 }
    ], []);

    assert.deepEqual(weather.getPrecipitationData(3, 7), [
      { time: 4, precipProbability: 0.4, precipIntensity: 1 },
      { time: 5, precipProbability: 0.5, precipIntensity: 1 },
      { time: 6, precipProbability: 0.6, precipIntensity: 1 },
      { time: 7, precipProbability: 0.7, precipIntensity: 1 }
    ]);
  });

  it("returns empty data if sunrise, sunset cannot be found", function() {
    const weather = new Weather("", [], []);
    assert.deepEqual(weather.getSunsetSunriseData(0), {});
  });

  it("returns sunrise/sunset time based on current time", function() {
    const weather = new Weather("", [], [
      { time: 0 * Time.DAY + 0, sunriseTime: 0, sunsetTime: 1 },
      { time: 1 * Time.DAY + 1, sunriseTime: 2, sunsetTime: 3 },
      { time: 2 * Time.DAY + 2, sunriseTime: 4, sunsetTime: 5 }
    ]);

    assert.deepEqual(weather.getSunsetSunriseData(0), { sunriseTime: 0, sunsetTime: 1 });
    assert.deepEqual(weather.getSunsetSunriseData(Time.DAY + 1), { sunriseTime: 2, sunsetTime: 3 });
    assert.deepEqual(weather.getSunsetSunriseData(Time.DAY + 2), { sunriseTime: 2, sunsetTime: 3 });
  });

});
