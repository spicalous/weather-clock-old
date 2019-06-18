import Clock from "./clock";

export default class WeatherClock {

  /**
   * @param {HTMLElement} container
   */
  constructor(container) {
    this._clock = new Clock(container);
    this._boundResize = this._resize.bind(this);

    // wait for layout/sizing of newly created DOM elements
    this._resizeTimeoutId = setTimeout(this._boundResize, 0);
    window.addEventListener("resize", this._boundResize);
  }

  destroy() {
    window.removeEventListener("resize", this._boundResize);
    clearTimeout(this._resizeTimeoutId);
    this._clock.destroy();
    delete this._clock;
    delete this._boundResize;
    delete this._resizeTimeoutId;
  }

  _resize() {
    this._clock.resize();
  }

}
