import { lineRadial, curveCatmullRomClosed, curveBasisClosed, curveLinear } from "d3-shape";
import Weather from "./model/weather";
import { hexToRGBA } from "./util/colour";
import { createElement } from "./util/dom";
import { padZero } from "./util/string";
import { TIME } from "./util/time";
import Canvas from "./canvas";

const PERCENTAGE_OF_OUTER_RADIUS_FOR_INNER_RADIUS = 0.4;
const EIGHTH = Math.PI / 4;
const TWENTY_FOURTH = Math.PI / 12;
const CYAN_700 = "#0097A7";
const AMBER_700 = "#FFA000";
const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

export default class Clock {

  /**
   * @param {HTMLElement} container
   */
  constructor(container) {
    this._container = container;
    this._line = lineRadial();
    this._weatherClockContainer = createElement("div", "weather-clock");
    this._bgCanvas = new Canvas(this._weatherClockContainer, "weather-clock_canvas-bg");
    this._fgCanvas = new Canvas(this._weatherClockContainer, "weather-clock_canvas-fg");

    this._infoContainer = createElement("div", "weather-clock_info");
    this._dateContainer = createElement("div", "weather-clock_info_date");
    this._timeContainer = createElement("div", "weather-clock_info_time");
    this._timezoneContainer = createElement("div", "weather-clock_info_timezone");
    this._weatherContainer = createElement("div", "weather-clock_info_weather");

    this._temperatureContainer = createElement("div", "weather-clock_info_weather_temperature");
    this._weatherContainer.appendChild(this._temperatureContainer);

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

  destroy() {
    this._container.removeChild(this._weatherClockContainer);
    this._bgCanvas.destroy();
    this._fgCanvas.destroy();
    delete this._line;
    delete this._bgCanvas;
    delete this._fgCanvas;
    delete this._dateContainer;
    delete this._timeContainer;
    delete this._timezoneContainer;
    delete this._infoContainer;
    delete this._weatherClockContainer;
    delete this._container;
  }

  resize() {
    const boundingClientRect = this._weatherClockContainer.getBoundingClientRect();
    const diameter = Math.min(boundingClientRect.width, boundingClientRect.height);
    this._bgCanvas.setDimensions(diameter, diameter);
    this._fgCanvas.setDimensions(diameter, diameter);
    this._infoContainer.style = `width: ${diameter}px; height: ${diameter}px;`;

    this._radius = diameter / 2;
    this._innerRadius = this._radius * PERCENTAGE_OF_OUTER_RADIUS_FOR_INNER_RADIUS;

    this._drawBackground(this._bgCanvas, this._radius, this._innerRadius);
    this.setTime(this._time);
    this.setWeather(this._weather);
  }

  /**
   * @param {Date} currentTime
   */
  setTime(currentTime) {
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

  /**
   * @param {Weather} weather
   */
  setWeather(weather) {
    const startTime = this._time.getTime() - TIME.HOUR;
    const endTime = startTime + TIME.DAY;
    const temperatures = weather.getTemperatureData(startTime, endTime);

    this._timezoneContainer.innerText = `${weather.getTimezone()}`;
    this._drawTemperature(this._radius, this._innerRadius, temperatures.min, temperatures.max, temperatures.data);
  }

  /**
   * @param {number} radius
   * @param {number} innerRadius
   * @param {number} min
   * @param {number} max
   * @param {object[]} temperatures
   */
  _drawTemperature(radius, innerRadius, min, max, temperatures) {

    const context = this._bgCanvas.getContext();

    this._line.curve(curveCatmullRomClosed);
    this._line.context(context);

    context.fillStyle = AMBER_700;
    context.strokeStyle = AMBER_700;

    let lineData = [];
    for (let i = 0; i < temperatures.length; i++) {
      const angle = new Date(temperatures[i].time).getHours() * TWENTY_FOURTH;
      const temperatureRadius = innerRadius + (innerRadius * ((temperatures[i].temperature - min) / (max - min)));
      lineData.push([angle, temperatureRadius]);

      if (temperatures[i].temperature === min || temperatures[i].temperature === max) {
        if (temperatures[i - 1] && (temperatures[i - 1].temperature === min || temperatures[i - 1].temperature === max)) {
          continue; // previous data point already drew min / max text
        } else {
          context.fillText(temperatures[i].temperature, temperatureRadius * 1.05 * Math.sin(angle), temperatureRadius * 1.05 * -Math.cos(angle));
        }
      }
    }

    context.beginPath();
    this._line(lineData);
    context.stroke();

    this._temperatureContainer.innerText = `Min: ${Number.isFinite(min) ? min : ""} Max: ${Number.isFinite(max) ? max : ""}`;
  }

  /**
   * @param {Canvas} canvas
   * @param {number} radius
   * @param {number} innerRadius
   */
  _drawBackground(canvas, radius, innerRadius) {
    canvas.clear("#000000");
    const context = this._bgCanvas.getContext();
    context.translate(this._radius, this._radius);

    this._line.curve(curveBasisClosed);
    this._line.context(context);

    context.strokeStyle = CYAN_700;
    context.lineWidth = 2;
    context.beginPath();
    this._drawCircle(this._line, radius);
    this._drawCircle(this._line, innerRadius);
    context.stroke();

    context.strokeStyle = hexToRGBA(CYAN_700, 0.7);
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

  /**
   * @param {lineRadial} line
   * @param {number} radius
   */
  _drawCircle(line, radius) {
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

  /**
   * @param {lineRadial} line
   * @param {CanvasRenderingContext2D} context
   * @param {number} radius
   */
  _drawClockTicks(line, context, radius) {
    for (let i = 0; i < 24; i++) {
      const radians = i * TWENTY_FOURTH;

      line([
        [radians, radius * 0.9],
        [radians, radius * 0.925]]);

      context.fillText(i, radius * 0.95 * Math.sin(radians), radius * 0.95 * -Math.cos(radians));
    }
  }

  /**
   * @param {lineRadial} line
   * @param {number} radius
   * @param {Date} date
   */
  _drawCurrentTimeLine(line, radius, innerRadius, date) {
    const angle = (date.getHours() * TWENTY_FOURTH) + (date.getMinutes() * (TWENTY_FOURTH / 60));
    line([
      [angle, radius * 0.36],
      [angle, radius * 0.9]]);
  }

}
