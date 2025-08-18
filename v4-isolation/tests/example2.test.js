import { add, count } from "../src/example.js";

test("adding 27 to count equals 27", () => {
  expect(add(count, 27)).toBe(27);
});
