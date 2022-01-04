import { def, make, on } from "../mod.ts";
import {
  assertEquals,
  assertThrows,
  clearComponents,
  deferred,
  genel,
} from "../test_helper.ts";

Deno.test("@on(event)", async (t) => {
  await t.step("throws when the event is empty", async () => {
    assertThrows(
      () => {
        class Component {
          @on(undefined)
          handler() {
            console.log();
          }
        }

        def("component", Component);
      },
      Error,
      "Empty event handler is given: constructor=Component key=handler",
    );
    await clearComponents();
  });

  await t.step(
    "registers the method as the event listener of the given event name",
    async () => {
      const p = deferred();
      class Component {
        @on("click")
        handler() {
          p.resolve();
        }
      }

      def("component", Component);

      const el = genel.div``;

      make("component", el);

      el.dispatchEvent(new Event("click"));
      await p;
      await clearComponents();
    },
  );

  await t.step(
    "registers the method as the event listener for children classes",
    async () => {
      const p = deferred();
      class Foo {
        @on("click")
        handler() {
          p.resolve();
        }
      }
      class Bar extends Foo {}
      class Baz extends Bar {}

      def("baz", Baz);

      const el = genel.div``;
      make("baz", el);
      el.dispatchEvent(new Event("click"));
      await p;
      await clearComponents();
    },
  );
});

Deno.test("@on(event, { at: selector })", async (t) => {
  await t.step(
    "registers the method as the event listener of the given event name and selector",
    async () => {
      const p = deferred();
      class Foo {
        @on("foo-event", { at: ".inner" })
        foo() {
          p.resolve();
        }
        @on("bar-event", { at: ".inner" })
        bar() {
          p.reject(new Error("bar should not be called"));
        }
      }
      def("foo", Foo);

      const el = genel.div`
      <div class="inner"></div>
    `;

      make("foo", el);

      if (document.body) {
        document.body.appendChild(el);
      }

      el.dispatchEvent(new CustomEvent("bar-event", { bubbles: true }));
      // FIXME(kt3k): deno_dom doesn't handle bubbling correctly
      // We need the following event handler as a workaround.
      el.querySelector(".inner")!.addEventListener("foo-event", () => {});
      el.querySelector(".inner")!.dispatchEvent(
        new CustomEvent("foo-event", { bubbles: true }),
      );

      if (document.body) {
        document.body.removeChild(el);
      }
      await p;
      await clearComponents();
    },
  );
});

Deno.test("@on.click", async (t) => {
  await t.step("binds method to click event", async () => {
    const p = deferred();
    class Component {
      @on.click
      handler() {
        p.resolve();
      }
    }

    def("foo", Component);

    const el = genel.div``;
    make("foo", el);
    el.dispatchEvent(new Event("click"));
    await p;
    await clearComponents();
  });
});

Deno.test("@on.click.at", async (t) => {
  await t.step("binds method to click event at the given element", async () => {
    let res = 0;

    class Component {
      @on.click.at(".foo")
      foo() {
        res += 1;
      }
      @on.click.at(".bar")
      bar() {
        res += 2;
      }
    }

    def("component", Component);

    const el = genel.div`
      <p class="foo"></p>
      <p class="bar"></p>
    `;

    make("component", el);
    const foo = el.querySelector(".foo")!;

    // FIXME(kt3k): deno_dom doesn't handle bubbling correctly
    // We need the following event handler as a workaround.
    foo.addEventListener("click", () => {});
    foo.dispatchEvent(new Event("click", { bubbles: true }));

    assertEquals(res, 1);
    await clearComponents();
  });
});
