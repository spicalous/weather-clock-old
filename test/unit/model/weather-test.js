import Weather from "../../../src/model/weather";

describe("model/weather", function() {

  it("returns pased in timezone", function() {
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

  it("returns empty data if no precipitation", function() {
    const weather = new Weather("", [], []);
    assert.deepEqual(weather.getPrecipitationData(0, 1), { data: [] });
  });

  it("returns precipitation data based on start/end time", function() {
    const weather = new Weather("", [
      { time: 0 },
      { time: 1 },
      { time: 2 },
      { time: 3 },
      { time: 4 },
      { time: 5 }
    ], []);

    assert.deepEqual(weather.getPrecipitationData(1, 4), {
      data: [
        { time: 2 },
        { time: 3 },
        { time: 4 }
      ]
    });
  });

  it("returns empty data if sunrise, sunset cannot be found", function() {
    const weather = new Weather("", [], []);
    assert.deepEqual(weather.getSunsetSunriseData(0), {});
  });

  it("returns sunrise/sunset time based on current time", function() {
    const weather = new Weather("", [], [
      { time: 0, sunriseTime: 0, sunsetTime: 1 },
      { time: 2, sunriseTime: 2, sunsetTime: 3 },
      { time: 4, sunriseTime: 4, sunsetTime: 5 }
    ]);

    assert.deepEqual(weather.getSunsetSunriseData(2), { sunriseTime: 2, sunsetTime: 3 });
    assert.deepEqual(weather.getSunsetSunriseData(3), { sunriseTime: 2, sunsetTime: 3 });
  });

});
