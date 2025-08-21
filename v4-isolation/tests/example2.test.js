import { add, counter } from "../src/example.js";

test("adding 27 to counter equals 27", () => {
  expect(add(counter, 27)).toBe(27);
});
