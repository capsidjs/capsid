import component from './component.ts';
import pub from './pub.ts';
import on from './on.ts';
import { def, prep } from '../mod.ts';
import {
  assertEquals,
  assertThrows,
  clearComponents,
  deferred,
  genel,
} from '../test_helper.ts';

Deno.test('@pub(event)', async (t) => {
  await t.step('throws error when empty event is given', () => {
    assertThrows(
      () => {
        class Component {
          // deno-lint-ignore no-explicit-any
          @pub(undefined as any)
          method() {
            console.log();
          }
        }

        def('component', Component);
      },
      Error,
      'Unable to publish empty event: constructor=Component key=method',
    );
    clearComponents();
  });

  await t.step(
    'publishes the event to the elements of the sub:event class',
    async () => {
      const CUSTOM_EVENT = 'foo-bar';

      class Component {
        @pub(CUSTOM_EVENT)
        @on('foo')
        publish() {
          console.log();
        }
      }

      def('component', Component);

      const el = genel.div`
      <div class="component"></div>
      <div class="elm child0 sub:foo-bar"></div>
      <div>
        <div></div>
        <div class="elm child1 sub:foo-bar"></div>
      </div>
      <div>
        <div>
        </div>
        <div>
          <div>
            <div class="elm child2 sub:foo-bar"></div>
            <div></div>
          </div>
        </div>
      </div>
    `;

      const child0 = el.querySelector('.child0')!;
      const child1 = el.querySelector('.child1')!;
      const child2 = el.querySelector('.child2')!;
      const comp = el.querySelector('.component')!;

      document.body.appendChild(el);

      prep();

      const promise0 = new Promise((resolve) =>
        child0.addEventListener(CUSTOM_EVENT, resolve)
      );
      const promise1 = new Promise((resolve) =>
        child1.addEventListener(CUSTOM_EVENT, resolve)
      );
      const promise2 = new Promise((resolve) =>
        child2.addEventListener(CUSTOM_EVENT, resolve)
      );

      comp.dispatchEvent(new CustomEvent('foo'));

      await Promise.all([promise0, promise1, promise2]);

      document.body.removeChild(el);
      clearComponents();
    },
  );

  await t.step('publishes events with the return value as detail', async () => {
    const p = deferred();
    const CUSTOM_EVENT = 'foo-bar';

    class Component {
      @pub(CUSTOM_EVENT)
      @on('foo')
      publish() {
        return { foo: 123, bar: 'baz' };
      }
    }

    def('component', Component);

    const el = genel.div`
      <div class="component">
      <div class="sub:foo-bar target">
    `;
    document.body.appendChild(el);
    const target = el.querySelector('.target');
    const comp = el.querySelector('.component');

    prep();

    // deno-lint-ignore no-explicit-any
    target!.addEventListener(CUSTOM_EVENT as any, (e: CustomEvent) => {
      assertEquals(e.detail, { foo: 123, bar: 'baz' });
      document.body.removeChild(el);
      p.resolve();
    });

    comp!.dispatchEvent(new CustomEvent('foo'));
    await p;
    clearComponents();
  });

  await t.step(
    'publishes events with the resolved value as detail if it is async function',
    async () => {
      const p = deferred();
      const CUSTOM_EVENT = 'foo-bar';

      class Component {
        @pub(CUSTOM_EVENT)
        @on('foo')
        publish() {
          return Promise.resolve({ foo: 123, bar: 'baz' });
        }
      }

      def('component', Component);

      const el = genel.div`
      <div class="sub:foo-bar target"></div>
      <div class="component"></div>
    `;
      document.body.appendChild(el);
      const target = el.querySelector('.target')!;
      const comp = el.querySelector('.component')!;

      prep();

      // deno-lint-ignore no-explicit-any
      target.addEventListener(CUSTOM_EVENT as any, (e: CustomEvent) => {
        assertEquals(e.detail, { foo: 123, bar: 'baz' });
        document.body.removeChild(el);
        p.resolve();
      });

      comp.dispatchEvent(new CustomEvent('foo'));
      await p;
      clearComponents();
    },
  );
});

Deno.test('@pub(event, selector)', async (t) => {
  await t.step('publishes events to the given selector', async () => {
    const p = deferred();
    const CUSTOM_EVENT = 'foo-bar';

    @component('component')
    // deno-lint-ignore no-unused-vars
    class Component {
      @pub(CUSTOM_EVENT, '#foo-bar-receiver')
      @on('foo')
      publish() {
        return { foo: 123, bar: 'baz' };
      }
    }

    const el = genel.div`
      <div class="component">
      <div class="target" id="foo-bar-receiver">
    `;
    document.body.appendChild(el);
    const target = el.querySelector('.target');
    const comp = el.querySelector('.component');

    prep();

    // deno-lint-ignore no-explicit-any
    target!.addEventListener(CUSTOM_EVENT as any, (e: CustomEvent) => {
      assertEquals(e.detail, { foo: 123, bar: 'baz' });
      document.body.removeChild(el);
      p.resolve();
    });

    comp!.dispatchEvent(new CustomEvent('foo'));
    await p;
    clearComponents();
  });
});
