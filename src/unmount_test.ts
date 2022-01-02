import { def, get, make, on, unmount } from './mod.ts';
import { assert, assertEquals, clearComponents, genel } from './test_helper.ts';

Deno.test('unmount', async (t) => {
  await t.step('removes class name, reference and event handlers', async () => {
    class Foo {
      el?: Element;

      @on.click
      @on('foo')
      method() {
        throw new Error('event handler called!');
      }
    }

    def('foo', Foo);

    const el = genel.div``;
    const coel = make<Foo>('foo', el);

    assert(el.classList.contains('foo'));
    assertEquals(coel.el, el);
    assertEquals(get<Foo>('foo', el), coel);

    unmount<Foo>('foo', el);

    assert(!el.classList.contains('foo'));
    assertEquals(coel.el, undefined);

    el.dispatchEvent(new Event('click'));
    el.dispatchEvent(new CustomEvent('foo'));

    await new Promise<void>((resolve) => setTimeout(() => resolve(), 100));
    clearComponents();
  });

  await t.step(
    'unmounts anscestor class\'s event handler correctly',
    async () => {
      class Foo {
        @on.click
        @on('foo')
        method() {
          throw new Error('event handler called!');
        }
      }

      class Bar extends Foo {}

      def('bar', Bar);

      const el = genel.div``;
      make<Bar>('bar', el);

      unmount<Bar>('bar', el);

      el.dispatchEvent(new Event('click'));
      el.dispatchEvent(new CustomEvent('foo'));

      await new Promise<void>((resolve) => setTimeout(() => resolve(), 100));
      clearComponents();
    },
  );

  await t.step('calls __unmount__ if exists', async () => {
    let resolve: () => void | undefined;
    const p = new Promise<void>((r) => {
      resolve = r;
    });
    class Foo {
      __unmount__() {
        resolve();
      }
    }

    def('foo', Foo);

    const el = genel.div``;

    make<Foo>('foo', el);

    unmount<Foo>('foo', el);
    await p;
    clearComponents();
  });

  await t.step(
    'does not unmount listeners of different component which mounted on the same element',
    async () => {
      let resolve: () => void | undefined;
      const p = new Promise<void>((r) => {
        resolve = r;
      });
      class Foo {}
      class Bar {
        @on.click
        method() {
          resolve();
        }
      }

      def('foo', Foo);
      def('bar', Bar);

      const el = genel.div``;

      make<Foo>('foo', el);
      make<Bar>('bar', el);
      unmount<Foo>('foo', el);

      el.dispatchEvent(new Event('click'));
      await p;
      clearComponents();
    },
  );
});
