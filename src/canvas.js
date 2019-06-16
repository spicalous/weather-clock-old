import { createElement } from "./util/dom";

export default class Canvas {

  /**
   * @param {HTMLElement} container
   * @param {string} className
   */
  constructor(container, className) {
    this._container = container;
    this._canvas = createElement("canvas", className);
    this._context = this._canvas.getContext("2d");
    this._container.appendChild(this._canvas);
  }

  /**
   * @returns {CanvasRenderingContext2D}
   */
  getContext() {
    return this._context;
  }

  /**
   * @param {number} width
   * @param {number} height
   */
  setDimensions(width, height) {
    this._canvas.width = `${width}`;
    this._canvas.height = `${height}`;
  }

  /**
   * @param {string} fillStyle
   */
  clear(fillStyle) {
    this._context.fillStyle = fillStyle;
    this._context.fillRect(0, 0, this._canvas.width, this._canvas.height);
  }

  /**
   *
   */
  destroy() {
    this._container.removeChild(this._canvas);
    delete this._context;
    delete this._canvas;
    delete this._container;
  }

}
