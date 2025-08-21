import { counter, add } from "../src/example.js";

test("adding 5 to counter equals 5", () => {
  expect(add(counter, 5)).toBe(5);
});
