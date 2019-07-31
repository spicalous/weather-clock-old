export function createElement(tag: "canvas", className: string): HTMLCanvasElement;
export function createElement(tag: string, className: string): HTMLElement;
export function createElement(tag: string, className: string): HTMLElement {
  const element = document.createElement(tag);
  element.className = className;
  return element;
}
