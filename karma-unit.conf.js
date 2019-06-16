module.exports = function(config) {
  config.set({
    singleRun: true,
    browsers: ["ChromeHeadless"],
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
