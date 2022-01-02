import { def, emits, make } from '../mod.ts';
import {
  assert,
  assertEquals,
  assertThrows,
  clearComponents,
  deferred,
  genel,
} from '../test_helper.ts';

Deno.test('@emits(event)', async (t) => {
  await t.step('throws when the empty event is given', () => {
    assertThrows(
      () => {
        class Component {
          // deno-lint-ignore no-explicit-any
          @emits(undefined as any)
          emitter() {
            console.log();
          }
        }
        console.log(Component);
      },
      Error,
      'Unable to emits an empty event: constructor=Component key=emitter',
    );
    clearComponents();
  });

  await t.step(
    'makes the method emit the event with the returned value',
    async () => {
      const p = deferred();
      class Component {
        @emits('event-foo')
        foo() {
          return 321;
        }
      }

      def('component', Component);

      const el = genel.div``;

      // deno-lint-ignore no-explicit-any
      el.addEventListener('event-foo' as any, (e: CustomEvent) => {
        assert(e.detail === 321);

        p.resolve();
      });

      make<Component>('component', el).foo();
      clearComponents();
      await p;
    },
  );

  await t.step(
    'makes the method emit the event with the resolved value after the promise resolved',
    async () => {
      const p = deferred();

      class Component {
        @emits('event-foo')
        foo() {
          return new Promise((resolve) => {
            setTimeout(() => {
              resolve(123);
            }, 100);
          });
        }
      }
      def('component', Component);

      const el = genel.div``;

      // deno-lint-ignore no-explicit-any
      el.addEventListener('event-foo' as any, (e: CustomEvent) => {
        assertEquals(e.detail, 123);

        p.resolve();
      });

      make<Component>('component', el).foo();
      clearComponents();

      await p;
    },
  );
});
