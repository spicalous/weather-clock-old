import { TIME } from "../util/time";
import { splitAndChunkByNull } from "../util/array";

/**
 * Container for semi processed weather data
 */
export default class Weather {

  /**
   * @param {string} timezone
   * @param {object[]} hourly
   * @param {number} hourly[].time
   * @param {number} hourly[].temperature
   * @param {number} hourly[].precipIntensity
   * @param {number} hourly[].precipProbability
   * @param {string} hourly[].precipType
   * @param {object[]} daily
   * @param {number} time
   * @param {number} sunriseTime
   * @param {number} sunsetTime
   */
  constructor(timezone, hourly, daily) {
    this._timezone = timezone;
    this._hourly = hourly;
    this._daily = daily;
  }

  getTimezone() {
    return this._timezone;
  }

  /**
   * @param {number} start
   * @param {number} end
   */
  getTemperatureData(start, end) {
    const visibleData = this._getVisible(this._hourly, start, end);
    const temperatures = visibleData.map(d => d.temperature);
    return {
      data: visibleData,
      min: Math.min.apply(Math, temperatures),
      max: Math.max.apply(Math, temperatures)
    };
  }

  /**
   * @param {number} start
   * @param {number} end
   */
  getPrecipitationData(start, end) {
    const visibleData = this._getVisible(this._hourly, start, end);
    const precipitation = visibleData.map(d => d.precipProbability >= 0.5 ? d : null);

    if (precipitation.filter(d => !!d).length > 0) {
      return splitAndChunkByNull(precipitation);
    }

    return [];
  }

  /**
   * @param {number} time
   */
  getSunsetSunriseData(time) {
    for (let i = 0; i < this._daily.length; i++) {
      if (this._daily[i].time <= time && time < this._daily[i].time + TIME.DAY) {
        return {
          sunriseTime: this._daily[i].sunriseTime,
          sunsetTime: this._daily[i].sunsetTime
        };
      }
    }

    return {};
  }

  destroy() {
    delete this._timezone;
    delete this._hourly;
    delete this._daily;
  }

  /**
   * @param {object[]} data
   * @param {number} data[].time
   * @param {number} start
   * @param {number} end
   */
  _getVisible(data, start, end) {
    return data.filter(d => start < d.time && d.time <= end);
  }

}