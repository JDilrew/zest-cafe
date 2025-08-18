import { add } from "../src/example.js";

test("original functionality works when not mocked", () => {
  expect(add(5, 5)).toBe(10);
});
