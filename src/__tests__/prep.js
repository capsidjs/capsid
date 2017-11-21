import assert from "assert";
import { prep, def } from "../index.js";
import { Foo } from "./fixture";
import { clearComponents } from "./helper";

describe("prep", () => {
  before(() => {
    def("foo", Foo);
  });

  beforeEach(() => {
    document.body.innerHTML = "";
  });

  after(() => clearComponents());

  it("initializes the class component of the given name", () => {
    const el = document.createElement("div");
    el.setAttribute("class", "foo");
    document.body.appendChild(el);

    prep("foo");

    assert(el.getAttribute("is_foo") === "true");
  });

  it("throws an error when the given name of class-component is not registered", () => {
    assert.throws(() => {
      prep("does-not-exist");
    }, Error);
  });
});
