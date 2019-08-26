import * as React from "react";
import * as ReactDOM from "react-dom";
import WeatherClockViewer from "./src/weather-clock-viewer";

const appElement = document.createElement("div");
appElement.id = "weather-clock-viewer";
document.body.appendChild(appElement);

ReactDOM.render(<WeatherClockViewer />, document.querySelector("#weather-clock-viewer"));
