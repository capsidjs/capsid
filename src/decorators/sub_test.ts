import sub from "./sub.ts";
import component from "./component.ts";
import make from "../make.ts";
import { assert, clearComponents } from "../test_helper.ts";

Deno.test("@sub(event)", async (t) => {
  await t.step("adds the class names to the element", async () => {
    @component("foo")
    @sub("bar")
    class Foo {}

    const el = document.createElement("div");
    const coel = make("foo", el);

    assert(coel instanceof Foo);
    assert(el.classList.contains("sub:bar"));
    await clearComponents();
  });
});
