import { def, make, wired } from "../mod.ts";
import { assertEquals, clearComponents, genel } from "../test_helper.ts";

Deno.test("@wired(selector)", async (t) => {
  await t.step("wires the element in the component", async () => {
    class Component {
      @wired(".elm")
      elm?: HTMLDivElement;
    }

    def("wire-el-test", Component);

    const el = genel.div`
      <div class="elm"></div>
    `;

    const component = make<Component>("wire-el-test", el);
    assertEquals(component.elm!.nodeName, "DIV");
    assertEquals(component.elm, el.firstChild);
    await clearComponents();
  });
});

Deno.test("@wired.all(selector)", async (t) => {
  await t.step("wires the all elements in the component", async () => {
    class Component {
      @wired.all(".elm")
      elms?: HTMLElement[];
    }

    def("comp", Component);

    const el = genel.div`
      <div class="elm"></div>
      <div class="elm"></div>
    `;

    const component = make<Component>("comp", el);
    assertEquals(component.elms!.length, 2);
    assertEquals(component.elms![0], el.firstChild);
    assertEquals(component.elms![1], el.lastChild);
    await clearComponents();
  });
});
