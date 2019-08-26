import * as React from "react";
import WeatherClock from "../../src/index";

class WeatherClockViewer extends React.Component {
  
  private _weatherClock?: WeatherClock;

  componentDidMount(): void {
    const containerElement = document.querySelector("#weather-clock-container");
    if (containerElement) {
      this._weatherClock = new WeatherClock(containerElement);
    }
  }

  render(): React.ReactNode {
    return (
      <>
        <div id="weather-clock-container"></div>
      </>
    );
  }

}

export default WeatherClockViewer;