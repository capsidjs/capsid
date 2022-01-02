import on from "./on.ts";

/**
 * @param at The selector
 */
export default (at: string) => on("click", { at });
