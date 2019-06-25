import Clock from "./clock";
import { mapData } from "./data-mapper";

const TIME_UPDATE_FREQ = 500;
const URL = "https://9k0pyk23f0.execute-api.eu-west-2.amazonaws.com/default/weatherClockCacheApi?fbclid=IwAR2mNngokPFwXQqMoRJcXPSwhE6SyLmCqVCqlUsSN2R1y08TZc-Xl1rjf0g";

export default class WeatherClock {

  /**
   * @param {HTMLElement} container
   */
  constructor(container) {
    this._clock = new Clock(container);
    this._boundResize = this._resize.bind(this);
    this._boundInit = this._init.bind(this);
    this._boundUpdate = this._update.bind(this);
    this._lastUpdatedTime = 0;
    this._lastUpdatedWeather = -1;

    // wait for layout/sizing of newly created DOM elements
    this._initTimeoutId = setTimeout(this._boundInit, 0);
    window.addEventListener("resize", this._boundResize);
  }

  destroy() {
    window.cancelAnimationFrame(this._updateId);
    window.removeEventListener("resize", this._boundResize);
    clearTimeout(this._initTimeoutId);
    this._clock.destroy();
    delete this._clock;
    delete this._boundResize;
    delete this._resizeTimeoutId;
  }

  _init() {
    this._resize();
    this._updateWeather(new Date());
    this._updateId = window.requestAnimationFrame(this._boundUpdate);
  }

  _update(timestamp) {
    if (this._lastUpdatedTime + TIME_UPDATE_FREQ < timestamp) {
      this._lastUpdatedTime = timestamp;
      const time = new Date();
      this._clock.setTime(time);
      this._updateWeather(time);
    }
    this._updateTimeId = window.requestAnimationFrame(this._boundUpdate);
  }

  _updateWeather(time) {
    if (this._lastUpdatedWeather < time.getHours() || (time.getHours() === 0 && this._lastUpdatedWeather !== 0)) {
      this._lastUpdatedWeather = time.getHours();
      this._fetchData(URL)
        .then(mapData)
        .then(this._clock.setWeather.bind(this._clock));
    }
  }

  _resize() {
    this._clock.resize();
  }

  /**
   * @param {string} url
   */
  _fetchData(url) {
    return fetch(url)
      .then(res => {
        if (!res.ok) {
          throw Error(res.statusText);
        }
        return res.json();
      })
      .catch(error => {
        // eslint-disable-next-line no-console
        console.error(error);
        return null;
      });
  }

}
