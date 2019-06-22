
/**
 * @param {object} dataPoint
 */
function mapHourly(dataPoint) {
  return {
    time: dataPoint.time,
    temperature: dataPoint.temperature || null,
    precipIntensity: dataPoint.precipIntensity || null,
    precipProbability: dataPoint.precipProbability || null,
    precipType: dataPoint.precipType || null
  };
}

/**
 * @param {object} dataPoint
 */
function mapDaily(dataPoint) {
  return {
    time: dataPoint.time,
    sunriseTime: dataPoint.sunriseTime || null,
    sunsetTime: dataPoint.sunsetTime || null
  };
}

/**
 * @param {object} data
 */
export function mapData(data) {
  return {
    timezone: data.timezone,
    hourly: data.hourly.data.map(mapHourly),
    daily: data.daily.data.map(mapDaily)
  };
}
