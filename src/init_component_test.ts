import * as capsid from "./mod.ts";
import initComponent from "./init_component.ts";
import { assert, assertEquals, clearComponents } from "./test_helper.ts";

const { on } = capsid;

Deno.test("initComponent", async (t) => {
  await t.step(
    "initializes the element as a component by the given constructor",
    () => {
      class A {}

      const el = document.createElement("div");
      const coel = initComponent(A, el);

      assertEquals(coel.el, el);
      assert(coel instanceof A);
    },
  );

  await t.step("calls __mount__", async () => {
    let resolve: () => void;
    const p = new Promise<void>((r) => {
      resolve = r;
    });
    class A {
      el?: HTMLElement;

      __mount__() {
        assertEquals(this.el, el);

        resolve();
      }
    }

    const el = document.createElement("div");

    initComponent(A, el);
    await p;
  });

  await t.step("__mount__ runs after @on handlers are set", async () => {
    let resolve: () => void;
    const p = new Promise<void>((r) => {
      resolve = r;
    });
    class A {
      el?: HTMLElement;

      __mount__() {
        this.el!.dispatchEvent(new CustomEvent("click"));
      }

      @on.click
      onClick() {
        resolve();
      }
    }

    initComponent(A, document.createElement("div"));
    await p;
  });

  await clearComponents();
});
