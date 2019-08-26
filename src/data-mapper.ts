import DailyData from "./model/daily-data";
import HourlyData from "./model/hourly-data";
import Weather from "./model/weather";
import { isDefined, isObject } from "./util/object";
import { fahrenheitToCelsius } from "./util/temperature";

function mapHourly(dataPoint: Partial<HourlyData>): HourlyData | null {
  if (isDefined(dataPoint.time) && isDefined(dataPoint.temperature)) {
    return {
      time: dataPoint.time * 1000,
      temperature: fahrenheitToCelsius(dataPoint.temperature),
      precipIntensity: dataPoint.precipIntensity,
      precipProbability: dataPoint.precipProbability,
      precipType: dataPoint.precipType
    };
  }
  return null;
}

function mapDaily(dataPoint: Partial<DailyData>): DailyData | null {
  if (isDefined(dataPoint.time)) {
    return {
      time: dataPoint.time * 1000,
      sunriseTime: dataPoint.sunriseTime ? dataPoint.sunriseTime * 1000 : undefined,
      sunsetTime: dataPoint.sunsetTime ? dataPoint.sunsetTime * 1000: undefined
    };
  }
  return null;
}

function parseHourlyData(data: { hourly?: { data?: unknown[] }}): HourlyData[] {
  if (data.hourly && data.hourly.data && Array.isArray(data.hourly.data)) {
    return data.hourly.data.map(mapHourly).filter(isDefined);
  }
  return [];
}

function parseDailyData(data: { daily?: { data?: unknown[] }}): DailyData[] {
  if (data.daily && data.daily.data && Array.isArray(data.daily.data)) {
    return data.daily.data.map(mapDaily).filter(isDefined);
  }
  return [];
}

function parseTimezone(data: { timezone?: string }): string {
  return typeof data.timezone === "string"
    ? data.timezone
    : "";
}

export function mapData(data: unknown): Weather {
  if (!isObject(data)) {
    return new Weather("", [], []);
  }
  return new Weather(parseTimezone(data), parseHourlyData(data), parseDailyData(data));
}