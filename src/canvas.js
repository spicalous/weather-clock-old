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
   * @param {string} [fillStyle]
   */
  clear(fillStyle) {
    this._context.setTransform(1, 0, 0, 1, 0, 0);
    if (fillStyle) {
      this._context.fillStyle = fillStyle;
      this._context.fillRect(0, 0, this._canvas.width, this._canvas.height);
    } else {
      this._context.clearRect(0, 0, this._canvas.width, this._canvas.height);
    }
  }

  /**
   * @param {number} width
   * @param {number} height
   */
  setDimensions(width, height) {
    const deviceRatio = window.devicePixelRatio || 1;
    const backingStoreRatio = window.webkitBackingStorePixelRatio
      || window.mozBackingStorePixelRatio
      || window.msBackingStorePixelRatio
      || window.oBackingStorePixelRatio
      || window.backingStorePixelRatio
      || 1;
    const pixelRatio = deviceRatio / backingStoreRatio;

    this._canvas.width = width * pixelRatio;
    this._canvas.height = height * pixelRatio;
    this._canvas.style.width = `${width}px`;
    this._canvas.style.height = `${height}px`;
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
