# Weather clock

Displays weather data on a 24hr clock face

# Notes
- Weather data is provided in hourly intervals (i.e. a data point every hour)
- The weather data is updated every hour, on the hour
  - e.g. If the current time is 00:00, the data point at 00:00 will be for the current day until 01:00, where 00:00 will then be updated for the next day
- Precipitation is displayed only if it has more than 10% probability
- Precipitation intensity is displayed at 4 levels
```
export enum PrecipitationIntensity {
  LIGHT,    // rate is < 2.5 mm (0.098 in) per hour
  MODERATE, // rate is between  2.5 mm (0.098 in) and 10 mm (0.392 in) per hour
  HEAVY,    // rate is between 10.0 mm (0.392 in) and 50 mm (2.000 in) per hour
  VIOLENT   // rate is > 50.0 mm (2.000 in) per hour
}
```
# TODO
- finite list of selectable cities
- display sunrise/sunset
- improve responsive font-sizes
