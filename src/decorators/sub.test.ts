import * as assert from "assert";
import sub from "./sub";
import component from "./component";
import make from "../make";
import { clearComponents } from "../test-helper";

describe("@sub(event)", () => {
  afterEach(() => {
    clearComponents();
  });

  it("adds the class names to the element", () => {
    @component("foo")
    @sub("bar")
    class Foo {}

    const el = document.createElement("div");
    const coel = make("foo", el);

    assert(coel instanceof Foo);
    assert(el.classList.contains("sub:bar"));
  });
});
