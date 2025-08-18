import { count, add } from "../src/example.js";

test("adding 5 to count equals 5", () => {
  expect(add(count, 5)).toBe(5);
});
