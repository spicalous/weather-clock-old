import Clock from "./clock";

const UPDATE_FREQ = 500;

export default class WeatherClock {

  /**
   * @param {HTMLElement} container
   */
  constructor(container) {
    this._clock = new Clock(container);
    this._boundResize = this._resize.bind(this);
    this._boundInit = this._init.bind(this);
    this._boundUpdateTime = this._updateTime.bind(this);
    this._lastUpdatedTime = 0;

    // wait for layout/sizing of newly created DOM elements
    this._initTimeoutId = setTimeout(this._boundInit, 0);
    window.addEventListener("resize", this._boundResize);
  }

  destroy() {
    window.cancelAnimationFrame(this._updateTimeId);
    window.removeEventListener("resize", this._boundResize);
    clearTimeout(this._initTimeoutId);
    this._clock.destroy();
    delete this._clock;
    delete this._boundResize;
    delete this._resizeTimeoutId;
  }

  _init() {
    this._resize();
    this._updateTimeId = window.requestAnimationFrame(this._boundUpdateTime);
  }

  _updateTime(timestamp) {
    if (this._lastUpdatedTime + UPDATE_FREQ < timestamp) {
      this._lastUpdatedTime = timestamp;
      this._clock.setTime(new Date());
    }
    this._updateTimeId = window.requestAnimationFrame(this._boundUpdateTime);
  }

  _resize() {
    this._clock.resize();
  }

}
