import { counter, add } from "../src/example.js";

test("adding 5 to counter equals 5", () => {
  expect(add(counter, 5)).toBe(5);
});

test("adding 2 to 3 equals 13", () => {
  expect(add(2, 3)).toBe(13);
});
