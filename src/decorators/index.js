import onClick from "./on.click.js";
import on from "./on.js";

on.click = onClick;

export { on };
export { default as emits } from "./emits.js";
export { default as wire } from "./wire.js";
export { default as component } from "./component.js";
export { default as notifies } from "./notifies.js";
