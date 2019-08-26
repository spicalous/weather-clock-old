interface HourlyData {
  time: number;
  temperature: number;
  precipIntensity?: number;
  precipProbability?: number;
  precipType?: string;
}

export default HourlyData;
