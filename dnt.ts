import { build } from 'https://deno.land/x/dnt@0.11.0/mod.ts';
import { join } from 'https://deno.land/std@0.119.0/path/mod.ts';

const outDir = 'node';

await build({
  entryPoints: ['./src/mod.ts'],
  outDir,
  shims: {
    // see JS docs for overview and more options
    deno: true,
  },
  cjs: false,
  typeCheck: false,
  test: false,
  package: {
    // package.json properties
    name: 'capsid',
    version: '1.7.1-b.0',
    description:
      'Declarative DOM programming library based on TypeScript decorators',
    license: 'MIT',
    repository: {
      type: 'git',
      url: 'git+https://github.com/capsidjs/capsid.git',
    },
    bugs: {
      url: 'https://github.com/capsidjs/capsid/issues',
    },
  },
});

Deno.copyFileSync('LICENSE', join(outDir, 'LICENSE'));
Deno.copyFileSync('README.md', join(outDir, 'README.md'));
