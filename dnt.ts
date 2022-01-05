import { build } from "https://raw.githubusercontent.com/kt3k/dnt/a20e97cfa0e92a3c688002d2fe838dba2ebb50bb/mod.ts";
import { join } from "https://deno.land/std@0.119.0/path/mod.ts";

const outDir = "node";

await build({
  entryPoints: ["./src/mod.ts"],
  outDir,
  shims: {
    deno: "dev",
  },
  redirects: {
    "./src/dom_polyfill_deno.ts": "./src/dom_polyfill_node.ts",
    "./src/td_deno.ts": "./src/td_node.ts",
  },
  test: true,
  package: {
    name: "capsid",
    version: "1.8.1",
    description:
      "Declarative DOM programming library based on TypeScript decorators",
    license: "MIT",
    repository: {
      type: "git",
      url: "git+https://github.com/capsidjs/capsid.git",
    },
    bugs: {
      url: "https://github.com/capsidjs/capsid/issues",
    },
    devDependencies: {
      jsdom: "^19.0.0",
      "@types/jsdom": "^16.2.14",
      testdouble: "^3.16.4",
    },
  },
});

Deno.copyFileSync("LICENSE", join(outDir, "LICENSE"));
Deno.copyFileSync("README.md", join(outDir, "README.md"));
