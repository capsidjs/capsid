import { def, get, make } from "./mod.ts";
import { Foo } from "./test_fixture.ts";
import { assert, clearComponents } from "./test_helper.ts";

Deno.test("get", async (t) => {
  def("foo", Foo);

  await t.step("gets the coelement instance from the element", () => {
    const el = document.createElement("div");

    make<Foo>("foo", el);

    const coel = get<Foo>("foo", el);

    assert(coel instanceof Foo);
    assert(coel.el === el);
  });

  clearComponents();
});
