import innerHTML from "./inner_html.ts";
import component from "./component.ts";
import make from "../make.ts";
import get from "../get.ts";
import { assert, clearComponents } from "../test_helper.ts";

Deno.test("@is", async (t) => {
  await t.step("adds the class names to the element", async () => {
    const html = `
      <p>hello</p>
    `;
    @component("foo")
    @innerHTML(html)
    class Foo {}

    const el = document.createElement("div");
    const coel = make("foo", el);

    assert(coel instanceof Foo);
    assert(el.innerHTML, html);
    await clearComponents();
  });

  await t.step("initializes the component inside the innerHTML", async () => {
    const html = `
      <p class="bar">hello</p>
    `;
    @component("foo")
    @innerHTML(html)
    // deno-lint-ignore no-unused-vars
    class Foo {}

    @component("bar")
    class Bar {}

    const el = document.createElement("div");
    make("foo", el);

    const bar = get("bar", el.querySelector(".bar")!);

    assert(bar instanceof Bar);
    await clearComponents();
  });
});
