const debug = process.argv.some(value => value === "--debug");

module.exports = function(config) {
  config.set({
    singleRun: !debug,
    browsers: [debug ? "Chrome" : "ChromeHeadless"],
    frameworks: ["mocha", "chai"],
    files: ["test/unit/**/*-test.js"],
    reporters: ["progress"],
    preprocessors: {
      "test/unit/**/*-test.js": ["webpack"]
    },
    webpack: {
      mode: "none"
    },
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: false,
    concurrency: Infinity
  });
};
