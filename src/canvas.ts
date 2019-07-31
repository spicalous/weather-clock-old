import { createElement } from "./util/dom";

function getBackingStoreRatio(): number {
  // @ts-ignore
  return window.webkitBackingStorePixelRatio || window.mozBackingStorePixelRatio || window.msBackingStorePixelRatio || window.oBackingStorePixelRatio || window.backingStorePixelRatio 
    || 1;
}
const DEVICE_RATIO = window.devicePixelRatio || 1;
const PIXEL_RATIO = DEVICE_RATIO / getBackingStoreRatio();

export default class Canvas {

  private _container: HTMLElement;
  private _canvas: HTMLCanvasElement;
  private _context: CanvasRenderingContext2D;

  constructor(container: HTMLElement, className: string) {
    this._container = container;
    this._canvas = createElement("canvas", className);
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    this._context = this._canvas.getContext("2d")!; // TODO remove non-null assertion
    this._container.appendChild(this._canvas);
  }

  getContext(): CanvasRenderingContext2D {
    return this._context;
  }

  clear(fillStyle?: string): void {
    this._context.setTransform(1, 0, 0, 1, 0, 0);
    this._context.scale(PIXEL_RATIO, PIXEL_RATIO);
    if (fillStyle) {
      this._context.fillStyle = fillStyle;
      this._context.fillRect(0, 0, this._canvas.width, this._canvas.height);
    } else {
      this._context.clearRect(0, 0, this._canvas.width, this._canvas.height);
    }
  }

  setDimensions(width: number, height: number): void {
    this._canvas.width = width * PIXEL_RATIO;
    this._canvas.height = height * PIXEL_RATIO;
    this._canvas.style.width = `${width}px`;
    this._canvas.style.height = `${height}px`;
    this._context.scale(PIXEL_RATIO, PIXEL_RATIO);
  }

  destroy(): void {
    this._container.removeChild(this._canvas);
    delete this._context;
    delete this._canvas;
    delete this._container;
  }

}
