import { Time } from "../model/time";
import { chunkBy } from "../util/array";
import { isDefined, isNull } from "../util/object";

/**
 * Container for semi processed weather data
 */
export default class Weather {

  private _timezone: string;
  private _hourly: HourlyData[];
  private _daily: DailyData[];

  constructor(timezone: string, hourly: HourlyData[], daily: DailyData[]) {
    this._timezone = timezone;
    this._hourly = hourly;
    this._daily = daily;
  }

  getTimezone(): string {
    return this._timezone;
  }

  getTemperatureData(start: number, end: number): { data: HourlyData[]; min: number; max: number } {
    const visibleData = this._getVisible(this._hourly, start, end);
    const temperatures = visibleData.map((d): number => d.temperature);

    return {
      data: visibleData,
      min: Math.min(...temperatures),
      max: Math.max(...temperatures)
    };
  }

  getPrecipitationData(start: number, end: number): HourlyData[][] {
    const visibleData = this._getVisible(this._hourly, start, end);
    const precipitation = visibleData.map((d): HourlyData | null => d.precipProbability && d.precipProbability >= 0.5 ? d : null);

    if (precipitation.filter(isDefined).length > 0) {
      return chunkBy<HourlyData, null>(precipitation, isNull);
    }

    return [];
  }

  getSunsetSunriseData(time: number): { sunriseTime?: number; sunsetTime?: number } {
    for (let i = 0; i < this._daily.length; i++) {
      if (this._daily[i].time <= time && time < this._daily[i].time + Time.DAY) {
        return {
          sunriseTime: this._daily[i].sunriseTime,
          sunsetTime: this._daily[i].sunsetTime
        };
      }
    }

    return {};
  }

  destroy(): void {
    delete this._timezone;
    delete this._hourly;
    delete this._daily;
  }

  private _getVisible<T extends { time: number }>(data: T[], start: number, end: number): T[] {
    return data.filter((d): boolean => start < d.time && d.time <= end);
  }

}