import { def, get, make } from "./mod.ts";
import { Foo } from "./test_fixture.ts";
import { assert, assertEquals, clearComponents } from "./test_helper.ts";

Deno.test("make", async (t) => {
  def("foo", Foo);

  await t.step(
    "initializes the element as an class-component of the given name",
    () => {
      const el = document.createElement("div");

      make("foo", el);

      assert(el.getAttribute("is_foo") === "true");
    },
  );

  await t.step("returns an instance of coelement", () => {
    assert(make("foo", document.createElement("div")) instanceof Foo);
  });

  await t.step("doesn't initialize element twice", () => {
    let a = 0;
    class A {
      __mount__() {
        a++;
      }
    }
    def("bar", A);

    const el = document.createElement("div");
    make("bar", el);
    make("bar", el);

    assertEquals(a, 1);
  });

  await t.step(
    "in __mount__, it can get component instance from el by the name",
    async () => {
      let resolve: () => void;
      const p = new Promise<void>((r) => {
        resolve = r;
      });

      class Component {
        el?: HTMLElement;

        __mount__() {
          assertEquals(get("bar", this.el!), this);

          resolve();
        }
      }

      def("bar", Component);

      make("bar", document.createElement("div"));
      await p;
    },
  );

  clearComponents();
});
