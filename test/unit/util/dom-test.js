import { createElement } from "../../../src/util/dom";

describe("util/dom", function() {

  let element;

  beforeEach(function() {
    element = createElement("div", "test-class");
    document.body.appendChild(element);
  });

  afterEach(function() {
    document.body.removeChild(element);
    assert.isNull(document.querySelector(".test-class"));
  });

  it("creates element with tag and class", function() {
    let result = document.querySelector(".test-class");

    assert.isOk(result);
    assert.strictEqual(result.tagName, "DIV");
  });

});
