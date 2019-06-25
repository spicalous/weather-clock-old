import Weather from "./model/weather";
import { fahrenheitToCelsius } from "./util/temperature";

/**
 * @param {object} dataPoint
 */
function mapHourly(dataPoint) {
  return {
    time: dataPoint.time * 1000,
    temperature: fahrenheitToCelsius(dataPoint.temperature) || null,
    precipIntensity: dataPoint.precipIntensity || null,
    precipProbability: dataPoint.precipProbability || null,
    precipType: dataPoint.precipType || null
  };
}

/**
 * @param {object} dataPoint
 */
function mapDaily(dataPoint) {
  return {
    time: dataPoint.time * 1000,
    sunriseTime: dataPoint.sunriseTime || null,
    sunsetTime: dataPoint.sunsetTime || null
  };
}

/**
 * @param {object} data
 * @param {string} data.timezone
 * @param {object[]} data.hourly
 * @param {number} data.hourly[].time
 * @param {number} [data.hourly[].precipIntensity]
 * @param {number} [data.hourly[].precipProbability]
 * @param {string} [data.hourly[].precipType]
 * @param {number} [data.hourly[].temperature]
 * @param {object[]} data.daily
 * @param {number} data.daily[].time
 * @param {number} [data.daily[].sunriseTime]
 * @param {number} [data.daily[].sunsetTime]
 */
export function mapData(data) {
  return new Weather(data.timezone, data.hourly.data.map(mapHourly), data.daily.data.map(mapDaily));
}
