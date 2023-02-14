import is from "./is.ts";

export default (...args: string[]) =>
// deno-lint-ignore ban-types
(Cls: Function) => {
  is(...args.map((event) => "sub:" + event))(Cls);
};
