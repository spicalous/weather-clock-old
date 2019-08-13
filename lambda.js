const https = require("https");
const url = `https://api.darksky.net/forecast/${process.env.DARK_SKY_API_KEY}/51.5074,0.1278?exclude=currently,minutely,flags,alerts`;
const SECOND = 1000;
const MINUTE = SECOND * 60;
const HOUR = MINUTE * 60;
const DAY = HOUR * 24;

let cacheLatestTime = 0;
let cacheResponse = null;

function wrapResponse(statusCode, body) {
  return {
    statusCode,
    body: JSON.stringify(body),
    headers: { "Access-Control-Allow-Origin": "https://spicalous.github.io" }
  };
}

function createResponseHandler(resolve) {

  return function handleResponse(res) {
    let rawData = "";
    res.setEncoding("utf8");
    res.on("data", (d) => { rawData = rawData + d; });
    res.on("end", () => {
      const data = JSON.parse(rawData);
      const latest = Math.max.apply(Math, data.hourly.data.map((point) => point.time));

      cacheLatestTime = latest * 1000;
      cacheResponse = data;

      resolve(wrapResponse(res.statusCode, data));
    });
  };
}

// eslint-disable-next-line no-unused-vars
exports.handler = function(event) {
  const requiredLatestTime = Date.now() + DAY;
  const promise = new Promise(function(resolve, reject) {

    if (requiredLatestTime >= cacheLatestTime) {
      // eslint-disable-next-line no-console
      console.log("Required latest time:", requiredLatestTime, " >= ", cacheLatestTime);
      https.get(url, createResponseHandler(resolve)).on("error", (e) => { reject(Error(e)); });
    } else {
      resolve(wrapResponse(200, cacheResponse));
    }

  });

  return promise;
};
