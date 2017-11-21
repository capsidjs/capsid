import assert from "assert";
import { expect } from "chai";
import { make, def, get } from "../index.js";
import { Foo } from "./fixture.js";
import { clearComponents } from "./helper.js";

describe("make", () => {
  before(() => {
    def("foo", Foo);
  });

  after(() => clearComponents());

  it("initializes the element as an class-component of the given name", () => {
    const el = document.createElement("div");

    make("foo", el);

    assert(el.getAttribute("is_foo") === "true");
  });

  it("returns an instance of coelement", () => {
    assert(make("foo", document.createElement("div")) instanceof Foo);
  });

  describe("in __init__", () => {
    it("can get coelement from el by the name", done => {
      class Component {
        __init__() {
          expect(get("bar", this.el)).to.equal(this);

          done();
        }
      }

      def("bar", Component);

      make("bar", document.createElement("div"));
    });
  });
});
