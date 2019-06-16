import WeatherClock from "../src/index";

function onDOMContentLoaded() {
  window.removeEventListener("DOMContentLoaded", onDOMContentLoaded);
  new WeatherClock(document.body);
}

window.addEventListener("DOMContentLoaded", onDOMContentLoaded);
