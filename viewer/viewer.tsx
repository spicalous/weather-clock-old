import * as React from "react";
import * as ReactDOM from "react-dom";
import cyan from "@material-ui/core/colors/cyan";
import { createMuiTheme, Theme } from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/styles';
import WeatherClockViewer from "./src/weather-clock-viewer";

const appElement = document.createElement("div");
appElement.id = "weather-clock-viewer";
document.body.appendChild(appElement);

const theme: Theme = createMuiTheme({ 
  palette: { 
    type: "dark",
    primary: {
      main: cyan[700]
    }
  }
});

ReactDOM.render(
  <ThemeProvider theme={theme}>
    <WeatherClockViewer />
  </ThemeProvider>,
  document.querySelector("#weather-clock-viewer"));
