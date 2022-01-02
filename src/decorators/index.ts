import on from "./on.ts";
import useHandler from "./on_use_handler.ts";

on.useHandler = useHandler;
on.useHandler("click");

export { on };
export { default as emits } from "./emits.ts";
export { default as wired } from "./wired.ts";
export { default as component } from "./component.ts";
export { default as is } from "./is.ts";
export { default as innerHTML } from "./inner_html.ts";
export { default as pub } from "./pub.ts";
export { default as sub } from "./sub.ts";
