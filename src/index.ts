import Clock from "./clock";
import { mapData } from "./data-mapper";

const TIME_UPDATE_FREQ = 500;
const URL = "https://9k0pyk23f0.execute-api.eu-west-2.amazonaws.com/default/weatherClockCacheApi?fbclid=IwAR2mNngokPFwXQqMoRJcXPSwhE6SyLmCqVCqlUsSN2R1y08TZc-Xl1rjf0g";

export default class WeatherClock {
  
  private _clock: Clock;
  private _boundResize: EventListener;
  private _boundUpdate: FrameRequestCallback;
  private _boundInit: EventListener;
  private _lastUpdatedTime: number;
  private _lastUpdatedWeather: number;
  private _initTimeoutId: number;
  private _updateId: number;
  private _updateTimeId: number;

  constructor(container: HTMLElement) {
    this._clock = new Clock(container);
    this._boundResize = this._resize.bind(this);
    this._boundUpdate = this._update.bind(this);
    this._boundInit = this._init.bind(this);
    this._updateId = 0;
    this._updateTimeId = 0;

    this._lastUpdatedTime = 0;
    this._lastUpdatedWeather = -1;

    // wait for layout/sizing of newly created DOM elements
    this._initTimeoutId = setTimeout(this._boundInit, 0);
    window.addEventListener("resize", this._boundResize);
  }

  destroy(): void {
    clearTimeout(this._initTimeoutId);
    delete this._initTimeoutId;
    window.removeEventListener("resize", this._boundResize);
    delete this._boundResize;
    window.cancelAnimationFrame(this._updateId);
    delete this._boundUpdate;
    this._clock.destroy();
    delete this._clock;
    delete this._lastUpdatedTime;
    delete this._lastUpdatedWeather;
  }

  _init(): void {
    this._resize();
    this._updateWeather(new Date());
    this._updateId = window.requestAnimationFrame(this._boundUpdate);
  }

  _update(timestamp: number): void {
    if (this._lastUpdatedTime + TIME_UPDATE_FREQ < timestamp) {
      this._lastUpdatedTime = timestamp;
      const time = new Date();
      this._clock.setTime(time);
      this._updateWeather(time);
    }
    this._updateTimeId = window.requestAnimationFrame(this._boundUpdate);
  }

  _updateWeather(time: Date): void {
    if (this._lastUpdatedWeather < time.getHours() || (time.getHours() === 0 && this._lastUpdatedWeather !== 0)) {
      this._lastUpdatedWeather = time.getHours();
      this._fetchData(URL)
        .then(mapData)
        .then(this._clock.setWeather.bind(this._clock));
    }
  }

  _resize(): void {
    this._clock.resize();
  }

  _fetchData(url: string): Promise<unknown> {
    return fetch(url)
      .then((res): Promise<unknown> => {
        if (!res.ok) {
          throw Error(res.statusText);
        }
        return res.json();
      })
      .catch((error): null => {
        // eslint-disable-next-line no-console
        console.error(error);
        return null;
      });
  }

}
