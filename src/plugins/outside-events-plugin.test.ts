import outsideEventsPlugin from "./outside-events-plugin";
import { install, mount, on } from "../index";

describe("outside-events-plugin", () => {
  before(() => {
    install(outsideEventsPlugin);
  });

  describe("on.outside", () => {
    it("add outside event handler", (done) => {
      class Component {
        @on.outside("click")
        handleOutsideClick() {
          done();
        }
      }

      const div = document.createElement("div");

      mount(Component, div);

      if (document.body) {
        document.body.click();
      }
    });
  });
});
