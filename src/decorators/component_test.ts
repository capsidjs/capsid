import { component, make } from "../mod.ts";
import { assert, clearComponents, genel } from "../test_helper.ts";

Deno.test("@component(name)", async (t) => {
  await t.step(
    "works as a class decorator and registers the class as a class component of the given name",
    () => {
      @component("decorated-component")
      class Foo {
        el?: HTMLElement;

        __mount__() {
          this.el!.setAttribute("this-is", "decorated-component");
        }
      }

      const el = genel.div``;

      const foo = make("decorated-component", el);

      assert(foo instanceof Foo);
      assert(el.getAttribute("this-is") === "decorated-component");

      clearComponents();
    },
  );
});
