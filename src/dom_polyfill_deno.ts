import { DOMParser } from "https://raw.githubusercontent.com/b-fuze/deno-dom/9e4814e8d8117d8410fabb726d118e144e49fbf3/deno-dom-wasm.ts";
// deno-lint-ignore no-explicit-any
(globalThis as any).document = new DOMParser().parseFromString(
  "<body></body>",
  "text/html",
);
// deno-lint-ignore no-explicit-any
(document as any).readyState = "complete";
