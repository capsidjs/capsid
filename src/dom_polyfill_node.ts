import jsdom from "jsdom";
const { JSDOM } = jsdom;
const dom = new JSDOM(`<!DOCTYPE html><p>Hello world</p>`);
// deno-lint-ignore no-explicit-any
(globalThis as any).document = dom.window.document;
// deno-lint-ignore no-explicit-any
(globalThis as any).CustomEvent = dom.window.CustomEvent;
// deno-lint-ignore no-explicit-any
(globalThis as any).Event = dom.window.Event;
