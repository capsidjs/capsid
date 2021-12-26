import * as capsid from "./index.ts";
import { assertEquals, assertThrows } from "./test_helper.ts";

Deno.test("install", async (t) => {
  await t.step("calls install method of the given module", async () => {
    let resolve: () => void;
    const p = new Promise<void>((r) => {
      resolve = r;
    });
    const options = { foo: "bar" };

    capsid.install(
      {
        install(capsidObj: unknown, options0: unknown) {
          assertEquals(capsidObj, capsid);
          assertEquals(options0, options);

          resolve();
        },
      },
      options,
    );
    await p;
  });

  await t.step(
    "throws when the given module does not have the install method",
    () => {
      assertThrows(
        () => {
          // deno-lint-ignore no-explicit-any
          capsid.install({} as any);
        },
        Error,
        "The given capsid module does not have `install` method. Please check the install call.",
      );
    },
  );
});
