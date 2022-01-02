import is from "./is.ts";
import component from "./component.ts";
import make from "../make.ts";
import { assert, clearComponents } from "../test_helper.ts";

Deno.test("@is", async (t) => {
  await t.step("adds the class names to the element", () => {
    @component("foo")
    @is("bar-observer")
    class Foo {}

    const el = document.createElement("div");
    const coel = make("foo", el);

    assert(coel instanceof Foo);
    assert(el.classList.contains("bar-observer"));
    clearComponents();
  });
});
