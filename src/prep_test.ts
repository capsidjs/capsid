import { def, prep } from './mod.ts';
import { Foo } from './test_fixture.ts';
import { assertEquals, assertThrows, clearComponents } from './test_helper.ts';

Deno.test('prep', async (t) => {
  def('foo', Foo);
  def('foo-2', Foo);

  const clear = () => {
    if (document.body) {
      document.body.innerHTML = '';
    }
  };

  await t.step('initializes the class component of the given name', () => {
    clear();
    const el = document.createElement('div');
    el.setAttribute('class', 'foo');

    if (document.body) {
      document.body.appendChild(el);
    }

    prep('foo');

    assertEquals(el.getAttribute('is_foo'), 'true');
  });

  await t.step('initializes all when call with empty args', () => {
    const el = document.createElement('div');
    el.setAttribute('class', 'foo');

    const el2 = document.createElement('div');
    el2.setAttribute('class', 'foo-2');

    if (document.body) {
      document.body.appendChild(el);
      document.body.appendChild(el2);
    }

    prep();

    assertEquals(el.getAttribute('is_foo'), 'true');
    assertEquals(el2.getAttribute('is_foo'), 'true');
  });

  await t.step(
    'throws an error when the given name of class-component is not registered',
    () => {
      assertThrows(() => {
        prep('does-not-exist');
      }, Error);
    },
  );

  clearComponents();
});
