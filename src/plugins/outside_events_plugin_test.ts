import "../test_helper.ts";
import outsideEventsPlugin from "./outside_events_plugin.ts";
import { install, mount, on } from "../mod.ts";

Deno.test("outside-events-plugin", async (t) => {
  install(outsideEventsPlugin);

  await t.step("on.outside adds outside event handler", async () => {
    let resolve: () => void | undefined;
    const p = new Promise<void>((r) => {
      resolve = r;
    });
    class Component {
      @on.outside("click")
      handleOutsideClick() {
        resolve();
      }
    }

    const div = document.createElement("div");
    document.body.appendChild(div);

    mount(Component, div);

    document.dispatchEvent(new Event("click"));
    await p;
  });
});
