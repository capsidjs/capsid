import { install } from '../mod.ts';
import debugPlugin from './debug_plugin.ts';
import { td } from '../test_helper.ts';

Deno.test('debug-plugin', async (t) => {
  const afterEach = () => {
    td.reset();
    // deno-lint-ignore no-explicit-any
    delete (globalThis as any).capsidDebugMessage;
  };

  await t.step('logs event and component names with event type message', () => {
    install(debugPlugin);

    const el = document.createElement('a');
    const e = { type: 'click', target: el };
    const coel = { constructor: { name: 'foo' }, el };

    td.replace(console, 'groupCollapsed');
    td.replace(console, 'log');
    td.replace(console, 'groupEnd');
    // deno-lint-ignore no-explicit-any
    (globalThis as any).capsidDebugMessage({
      type: 'event',
      e,
      coel,
      module: 'module',
    });

    td.verify(
      console.groupCollapsed(
        'module> %cclick%c on %cfoo',
        'color: #f012be; font-weight: bold;',
        '',
        'color: #1a80cc; font-weight: bold;',
      ),
    );
    td.verify(console.log(e));
    td.verify(console.groupEnd());

    afterEach();
  });

  await t.step('logs error message with unknown type message', () => {
    install(debugPlugin);

    td.replace(console, 'log');
    // deno-lint-ignore no-explicit-any
    (globalThis as any).capsidDebugMessage({ type: 'unknown' });

    td.verify(
      console.log(`Unknown message: ${JSON.stringify({ type: 'unknown' })}`),
    );

    afterEach();
  });
});
