import { lineRadial, LineRadial, curveCatmullRomClosed, curveBasisClosed, curveLinear } from "d3-shape";
import { Time } from "./model/time";
import Weather from "./model/weather";
import { hexToRGBA } from "./util/colour";
import { createElement } from "./util/dom";
import { padZero } from "./util/string";
import Canvas from "./canvas";

const PERCENTAGE_OF_OUTER_RADIUS_FOR_INNER_RADIUS = 0.4;
const EIGHTH = Math.PI / 4;
const TWENTY_FOURTH = Math.PI / 12;
const CYAN_700 = "#0097A7";
const AMBER_700 = "#FFA000";
const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

export default class Clock {

  private _container: HTMLElement;
  private _line: LineRadial<[number, number]>;
  private _weatherClockContainer: HTMLElement;
  private _bgCanvas: Canvas;
  private _weatherCanvas: Canvas;
  private _fgCanvas: Canvas;
  private _infoContainer: HTMLElement;
  private _dateContainer: HTMLElement;
  private _timeContainer: HTMLElement;
  private _timezoneContainer: HTMLElement;
  private _weatherContainer: HTMLElement;
  private _currentTempContainer: HTMLElement;
  private _maxTempContainer: HTMLElement;
  private _minTempContainer: HTMLElement;
  private _radius: number;
  private _innerRadius: number;
  private _time: Date;
  private _weather: Weather;
  
  constructor(container: HTMLElement) {
    this._container = container;
    this._line = lineRadial();
    this._weatherClockContainer = createElement("div", "weather-clock");
    this._bgCanvas = new Canvas(this._weatherClockContainer, "weather-clock_canvas-bg");
    this._weatherCanvas = new Canvas(this._weatherClockContainer, "weather-clock_canvas-weather");
    this._fgCanvas = new Canvas(this._weatherClockContainer, "weather-clock_canvas-fg");

    this._infoContainer = createElement("div", "weather-clock_info");
    this._dateContainer = createElement("div", "weather-clock_info_date");
    this._timeContainer = createElement("div", "weather-clock_info_time");
    this._timezoneContainer = createElement("div", "weather-clock_info_timezone");
    this._weatherContainer = createElement("div", "weather-clock_info_weather");

    this._currentTempContainer = createElement("div", "weather-clock_info_weather_temperature-current");
    this._maxTempContainer = createElement("div", "weather-clock_info_weather_temperature-min-max");
    this._minTempContainer = createElement("div", "weather-clock_info_weather_temperature-min-max");
    this._weatherContainer.appendChild(this._currentTempContainer);
    this._weatherContainer.appendChild(this._maxTempContainer);
    this._weatherContainer.appendChild(this._minTempContainer);

    this._infoContainer.appendChild(this._dateContainer);
    this._infoContainer.appendChild(this._timeContainer);
    this._infoContainer.appendChild(this._timezoneContainer);
    this._infoContainer.appendChild(this._weatherContainer);

    this._weatherClockContainer.appendChild(this._infoContainer);
    this._container.appendChild(this._weatherClockContainer);

    this._radius = 0;
    this._innerRadius = 0;
    this._time = new Date();
    this._weather = new Weather("", [], []);
  }

  destroy(): void {
    this._container.removeChild(this._weatherClockContainer);
    this._bgCanvas.destroy();
    this._fgCanvas.destroy();
    this._weatherCanvas.destroy();
    delete this._line;
    delete this._bgCanvas;
    delete this._fgCanvas;
    delete this._minTempContainer;
    delete this._maxTempContainer;
    delete this._currentTempContainer;
    delete this._weatherContainer;
    delete this._dateContainer;
    delete this._timeContainer;
    delete this._timezoneContainer;
    delete this._infoContainer;
    delete this._weatherClockContainer;
    delete this._container;
  }

  resize(): void{
    const boundingClientRect = this._weatherClockContainer.getBoundingClientRect();
    const diameter = Math.min(boundingClientRect.width, boundingClientRect.height);
    this._bgCanvas.setDimensions(diameter, diameter);
    this._fgCanvas.setDimensions(diameter, diameter);
    this._weatherCanvas.setDimensions(diameter, diameter);
    this._infoContainer.style.width = `${diameter}px;`;
    this._infoContainer.style.height = `${diameter}px;`;

    this._radius = diameter / 2;
    this._innerRadius = this._radius * PERCENTAGE_OF_OUTER_RADIUS_FOR_INNER_RADIUS;

    this._drawBackground(this._bgCanvas, this._radius, this._innerRadius);
    this.setTime(this._time);
    this.setWeather(this._weather);
  }

  /**
   * @param {Date} currentTime
   */
  setTime(currentTime: Date): void {
    this._time = currentTime;
    this._fgCanvas.clear();
    const context = this._fgCanvas.getContext();
    context.translate(this._radius, this._radius);
    context.strokeStyle = CYAN_700;
    context.lineWidth = 2;
    context.beginPath();
    this._line.context(context);
    this._line.curve(curveLinear);
    this._drawCurrentTimeLine(this._line, this._radius, this._innerRadius, this._time);
    context.stroke();

    this._dateContainer.innerText = `${DAYS[this._time.getDay()]} ${this._time.getDate()} ${MONTHS[this._time.getMonth()]}`;
    this._timeContainer.innerText = `${padZero(this._time.getHours())}:${padZero(this._time.getMinutes())}`;
  }

  setWeather(weather: Weather): void {
    this._weather = weather;
    this._weatherCanvas.clear();
    const context = this._weatherCanvas.getContext();
    context.translate(this._radius, this._radius);
    context.textAlign = "center";
    context.textBaseline = "middle";

    const startTime = this._time.getTime() - Time.HOUR;
    const endTime = startTime + Time.DAY;
    const temperatures = weather.getTemperatureData(startTime, endTime);

    this._timezoneContainer.innerText = `${weather.getTimezone()}`;
    this._drawTemperature(context, this._radius, this._innerRadius, temperatures.min, temperatures.max, temperatures.data);
  }

  _drawTemperature(context: CanvasRenderingContext2D, radius: number, innerRadius: number, min: number, max: number, temperatures: HourlyData[]): void {
    this._line.curve(curveCatmullRomClosed);
    this._line.context(context);

    context.fillStyle = AMBER_700;
    context.strokeStyle = AMBER_700;

    const lineData: [number, number][] = [];
    for (let i = 0; i < temperatures.length; i++) {
      const angle = new Date(temperatures[i].time).getHours() * TWENTY_FOURTH;
      const temperatureRadius = innerRadius + (innerRadius * ((temperatures[i].temperature - min) / (max - min)));
      lineData.push([angle, temperatureRadius]);

      if (temperatures[i].temperature === min || temperatures[i].temperature === max) {
        if (temperatures[i - 1] && (temperatures[i - 1].temperature === min || temperatures[i - 1].temperature === max)) {
          continue; // previous data point already drew min / max text
        } else {
          context.fillText(`${temperatures[i].temperature}`, temperatureRadius * 1.07 * Math.sin(angle), temperatureRadius * 1.07 * -Math.cos(angle));
        }
      }
    }

    context.beginPath();
    this._line(lineData);
    context.stroke();

    this._currentTempContainer.innerText = temperatures.length ? `${temperatures[0].temperature}°C` : "";
    this._maxTempContainer.innerText = Number.isFinite(max) ? `${max}°C` : "";
    this._minTempContainer.innerText = Number.isFinite(min) ? `${min}°C` : "";
  }

  _drawBackground(canvas: Canvas, radius: number, innerRadius: number): void {
    canvas.clear("#000000");
    const context = canvas.getContext();
    context.translate(this._radius, this._radius);

    this._line.curve(curveBasisClosed);
    this._line.context(context);

    context.strokeStyle = CYAN_700;
    context.lineWidth = 2;
    context.beginPath();
    this._drawCircle(this._line, radius);
    this._drawCircle(this._line, innerRadius);
    context.stroke();

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    context.strokeStyle = hexToRGBA(CYAN_700, 0.7)!; // TODO hardcode
    context.lineWidth = 1;
    context.beginPath();
    this._drawCircle(this._line, radius * 1.01);
    this._drawCircle(this._line, innerRadius * 1.02);
    context.stroke();

    context.lineWidth = 2;
    context.textAlign = "center";
    context.textBaseline = "middle";
    context.fillStyle = CYAN_700;
    context.beginPath();
    this._line.curve(curveLinear);
    this._drawClockTicks(this._line, context, radius);
    context.stroke();
  }

  _drawCircle(line: LineRadial<[number, number]>, radius: number): void {
    line([
      [0, radius],
      [EIGHTH, radius],
      [EIGHTH * 2, radius],
      [EIGHTH * 3, radius],
      [Math.PI, radius],
      [Math.PI + EIGHTH, radius],
      [Math.PI + EIGHTH * 2, radius],
      [Math.PI + EIGHTH * 3, radius]]);
  }

  _drawClockTicks(line: LineRadial<[number, number]>, context: CanvasRenderingContext2D, radius: number): void {
    for (let i = 0; i < 24; i++) {
      const radians = i * TWENTY_FOURTH;

      line([
        [radians, radius * 0.9],
        [radians, radius * 0.925]]);

      context.fillText(`${i}`, radius * 0.95 * Math.sin(radians), radius * 0.95 * -Math.cos(radians));
    }
  }

  _drawCurrentTimeLine(line: LineRadial<[number, number]>, radius: number, innerRadius: number, date: Date): void {
    const angle = (date.getHours() * TWENTY_FOURTH) + (date.getMinutes() * (TWENTY_FOURTH / 60));
    line([
      [angle, radius * 0.36],
      [angle, radius * 0.9]]);
  }

}
