// deno-lint-ignore no-explicit-any
declare let capsidDebugMessage: any;

export default (message: unknown) => {
  if (typeof capsidDebugMessage === "function") {
    capsidDebugMessage(message);
  }
};
