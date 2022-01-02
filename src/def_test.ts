import { def, make } from './mod.ts';
import { assert, assertThrows, clearComponents } from './test_helper.ts';

Deno.test('def', async (t) => {
  await t.step('throws an error when the first param is not a string', () => {
    assertThrows(() => {
      // deno-lint-ignore no-explicit-any
      def(null as any, class A {});
    }, Error);
  });

  await t.step(
    'throws an error when the second param is not a function',
    () => {
      assertThrows(() => {
        // deno-lint-ignore no-explicit-any
        def('register-test2', null as any);
      }, Error);
    },
  );

  await t.step('registers the given class by the given name component', () => {
    class A {}
    def('assign-test2', A);

    const el = document.createElement('div');
    const coel = make('assign-test2', el);

    assert(coel instanceof A);
  });

  clearComponents();
});
