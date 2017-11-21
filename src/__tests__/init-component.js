import * as capsid from "../index.js";
import initComponent from "../init-component.js";
import assert from "power-assert";
import { clearComponents, callDecorator } from "./helper.js";

const { on } = capsid;

describe("initComponent", () => {
  afterEach(() => {
    clearComponents();
  });

  it("initializes the element as a component by the given constructor", () => {
    class A {}

    const el = document.createElement("div");
    const coelem = initComponent(A, el);

    assert(coelem instanceof A);
    assert.strictEqual(coelem.el, el);
  });

  it("calls __init__", done => {
    class A {
      __init__() {
        assert.strictEqual(this.el, el);

        done();
      }
    }

    const el = document.createElement("div");

    initComponent(A, el);
  });

  it("calls static __init__", done => {
    class A {
      static __init__() {
        assert.strictEqual(this.capsid, capsid);

        done();
      }
    }

    initComponent(A, document.createElement("div"));
  });

  describe("__init__", () => {
    it("runs after @on handlers are set", done => {
      class A {
        __init__() {
          this.el.click();
        }

        onClick() {
          done();
        }
      }

      callDecorator(on.click, A, "onClick");

      initComponent(A, document.createElement("div"));
    });
  });
});
