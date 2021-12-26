import { assertEquals } from "./test_helper.ts";
import { mount } from "./index.ts";

Deno.test("mount initializes the element by the given component class", async () => {
  let resolve: () => void;
  const p = new Promise<void>((r) => {
    resolve = r;
  });

  class Component {
    el?: HTMLElement;

    __mount__() {
      assertEquals(this.el, div);
      resolve();
    }
  }

  const div = document.createElement("div");

  mount(Component, div);
  await p;
});
