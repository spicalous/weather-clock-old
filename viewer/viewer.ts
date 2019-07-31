import WeatherClock from "../src/index";

function onDOMContentLoaded(): void {
  window.removeEventListener("DOMContentLoaded", onDOMContentLoaded);
  new WeatherClock(document.body);
}

window.addEventListener("DOMContentLoaded", onDOMContentLoaded);
