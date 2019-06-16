import Canvas from "../../src/canvas";

describe("canvas", function() {

  let testContainer;

  beforeEach(function() {
    testContainer = document.createElement("div");
    testContainer.className = "test-container";
    document.body.appendChild(testContainer);
  });

  afterEach(function() {
    document.body.removeChild(testContainer);
    assert.isNull(document.querySelector(".test-container"));
  });

  it("appends canvas to DOM with class name on construction", function() {
    new Canvas(testContainer, "test-class");

    let result = document.querySelector("canvas.test-class");

    assert.isOk(result);
  });

  it("removes canvas from DOM on destruction", function() {
    let canvas = new Canvas(testContainer, "test-class");

    canvas.destroy();

    assert.isNull(document.querySelector("canvas.test-class"));
  });

  it("updates canvas width and height attributes", function() {
    let canvas = new Canvas(testContainer, "test-class");

    canvas.setDimensions(42, 42);

    let canvasElement = document.querySelector("canvas.test-class");

    assert.strictEqual(canvasElement.width, 42);
    assert.strictEqual(canvasElement.height, 42);
  });

});
