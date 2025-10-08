import { suma } from "../src/index.js";

test("suma correcta", () => {
  expect(suma(2, 3)).toBe(5);
});
