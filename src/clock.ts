import { areaRadial, AreaRadial, lineRadial, LineRadial, curveCatmullRomClosed, curveCatmullRom, curveLinear } from "d3-shape";
import { PrecipitationIntensity, inchesToPrecipitationIntensity } from "./model/precipitation-intensity";
import { Time } from "./model/time";
import Weather from "./model/weather";
import { hexToRGBA } from "./util/colour";
import { createElement } from "./util/dom";
import { padZero } from "./util/string";
import Canvas from "./canvas";

const PERCENTAGE_OF_OUTER_RADIUS_FOR_INNER_RADIUS = 0.4;
const PRECIPITATION_PERCENTAGE_MAP = {
  [PrecipitationIntensity.LIGHT]: 0.08,
  [PrecipitationIntensity.MODERATE]: 0.3,
  [PrecipitationIntensity.HEAVY]: 0.6,
  [PrecipitationIntensity.VIOLENT]: 0.9
};
const TWENTY_FOURTH = Math.PI / 12;
const CYAN_700 = "#0097A7";
const AMBER_700 = "#FFA000";
const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

export default class Clock {

  private _container: HTMLElement;
  private _line: LineRadial<[number, number]>;
  private _area: AreaRadial<[number, number]>;
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
  private _midPoint: number;
  private _radius: number;
  private _innerRadius: number;
  private _distance: number;
  private _time: Date;
  private _weather: Weather;
  
  constructor(container: HTMLElement) {
    this._container = container;
    this._line = lineRadial();
    this._area = areaRadial();
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

    this._midPoint = 0;
    this._radius = 0;
    this._innerRadius = 0;
    this._distance = 0;
    this._time = new Date();
    this._weather = new Weather("", [], []);
  }

  destroy(): void {
    this._container.removeChild(this._weatherClockContainer);
    this._bgCanvas.destroy();
    this._fgCanvas.destroy();
    this._weatherCanvas.destroy();
    delete this._line;
    delete this._area;
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
    const shortestLength = Math.min(boundingClientRect.width, boundingClientRect.height);
    this._bgCanvas.setDimensions(shortestLength, shortestLength);
    this._fgCanvas.setDimensions(shortestLength, shortestLength);
    this._weatherCanvas.setDimensions(shortestLength, shortestLength);
    this._infoContainer.style.width = `${shortestLength}px;`;
    this._infoContainer.style.height = `${shortestLength}px;`;

    this._midPoint = shortestLength / 2;
    this._radius = 0.9 * (shortestLength / 2);
    this._innerRadius = this._radius * PERCENTAGE_OF_OUTER_RADIUS_FOR_INNER_RADIUS;
    this._distance = this._radius - this._innerRadius;

    this._drawBackground(this._bgCanvas, this._radius, this._innerRadius);
    this.setTime(this._time);
    this.setWeather(this._weather);
  }

  setTime(currentTime: Date): void {
    this._time = currentTime;
    this._fgCanvas.clear();
    const context = this._fgCanvas.getContext();
    context.translate(this._midPoint, this._midPoint);
    context.strokeStyle = CYAN_700;
    context.lineWidth = 2;
    context.beginPath();
    this._line.context(context);
    this._line.curve(curveLinear);
    const angle = (this._time.getHours() * TWENTY_FOURTH) + (this._time.getMinutes() * (TWENTY_FOURTH / 60));
    this._line([[angle, this._innerRadius], [angle, this._radius]]);
    context.stroke();

    this._dateContainer.innerText = `${DAYS[this._time.getDay()]} ${this._time.getDate()} ${MONTHS[this._time.getMonth()]}`;
    this._timeContainer.innerText = `${padZero(this._time.getHours())}:${padZero(this._time.getMinutes())}`;
  }

  setWeather(weather: Weather): void {
    this._weather = weather;
    this._weatherCanvas.clear();
    const context = this._weatherCanvas.getContext();
    context.translate(this._midPoint, this._midPoint);
    context.textAlign = "center";
    context.textBaseline = "middle";

    const startTime = this._time.getTime() - Time.HOUR;
    const endTime = startTime + Time.DAY;
    const temperatures = weather.getTemperatureData(startTime, endTime);

    this._timezoneContainer.innerText = `${weather.getTimezone()}`;
    this._drawTemperature(context, this._radius, this._innerRadius, temperatures.min, temperatures.max, temperatures.data);
    this._drawPrecipitation(context, this._radius, this._innerRadius, weather.getPrecipitationData(startTime, endTime + Time.HOUR));
  }

  private _drawTemperature(context: CanvasRenderingContext2D, radius: number, innerRadius: number, min: number, max: number, temperatures: HourlyData[]): void {
    this._line.curve(curveCatmullRomClosed);
    this._line.context(context);

    context.fillStyle = AMBER_700;
    context.strokeStyle = AMBER_700;

    const lineData: [number, number][] = [];
    for (let i = 0; i < temperatures.length; i++) {
      const angle = new Date(temperatures[i].time).getHours() * TWENTY_FOURTH;
      const temperaturePercentage = (temperatures[i].temperature - min) / (max - min);
      // inner padding (0.05) must be no larger than (1 - x) / 2, currently x = 0.8
      const temperatureRadius = innerRadius + (this._distance * 0.05) + ((this._distance * 0.8) * temperaturePercentage);
      
      lineData.push([angle, temperatureRadius]);

      const padding = Math.max(7, Math.min(0.07 * temperatureRadius, 10));
      if (temperatures[i].temperature === min || temperatures[i].temperature === max) {
        const previousMinOrMax = temperatures[i - 1] && (temperatures[i - 1].temperature === min || temperatures[i - 1].temperature === max);
        const nextMinOrMax = temperatures[i + 1] && (temperatures[i + 1].temperature === min || temperatures[i + 1].temperature === max);
        if (previousMinOrMax && nextMinOrMax) {
          continue; // between min/max already, do not label
        } else {
          context.fillText(`${temperatures[i].temperature}`, (padding + temperatureRadius) * Math.sin(angle), (padding + temperatureRadius) * -Math.cos(angle));
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

  private _drawPrecipitation(context: CanvasRenderingContext2D, radius: number, innerRadius: number, precipitationData: HourlyData[]): void {
    const ariaRadialInnerRadius = this._innerRadius * 1.04;
    // TODO hardcode RGBA
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    context.fillStyle = hexToRGBA(CYAN_700, 0.25)!;
    this._area.context(context);
    this._area.curve(curveCatmullRom);
    this._area.innerRadius(ariaRadialInnerRadius);
    const areaData: [number, number][] = precipitationData.length 
      ? [[(new Date(precipitationData[0].time).getHours() - 1) * TWENTY_FOURTH, ariaRadialInnerRadius]]
      : [];
    
    for (let i = 0; i < precipitationData.length; i++) {
      const precipitation = precipitationData[i];
      const angle = new Date(precipitation.time).getHours() * TWENTY_FOURTH;
      if (precipitation.precipIntensity && precipitation.precipType && precipitation.precipProbability && precipitation.precipProbability > 0.1) {
        const radius = innerRadius + (this._distance * 0.8) * PRECIPITATION_PERCENTAGE_MAP[inchesToPrecipitationIntensity(precipitation.precipIntensity)];
        areaData.push([angle, radius]);
      } else {
        areaData.push([angle, ariaRadialInnerRadius]);
      }
    }
    context.beginPath();
    this._area(areaData);
    context.fill();
  }

  private _drawBackground(canvas: Canvas, radius: number, innerRadius: number): void {
    canvas.clear("#000000");
    const context = canvas.getContext();
    context.translate(this._midPoint, this._midPoint);

    this._line.context(context);

    context.strokeStyle = CYAN_700;
    context.lineWidth = 2;
    context.beginPath();
    this._drawCircle(context, radius);
    this._drawCircle(context, innerRadius);
    context.stroke();

    // TODO hardcode RGBA
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    context.strokeStyle = hexToRGBA(CYAN_700, 0.7)!;
    context.lineWidth = 1;
    context.beginPath();
    this._drawCircle(context, radius * 1.01);
    this._drawCircle(context, innerRadius * 1.02);
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

  private _drawCircle(context: CanvasRenderingContext2D, radius: number): void {
    context.moveTo(radius, 0);
    context.arc(0, 0, radius, 0, 2 * Math.PI);
  }

  private _drawClockTicks(line: LineRadial<[number, number]>, context: CanvasRenderingContext2D, radius: number): void {
    for (let i = 0; i < 24; i++) {
      const radians = i * TWENTY_FOURTH;

      line([
        [radians, radius],
        [radians, radius * 1.025]]);

      context.fillText(`${i}`, radius * 1.05 * Math.sin(radians), radius * 1.05 * -Math.cos(radians));
    }
  }

}
