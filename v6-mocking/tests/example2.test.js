import { add } from "../src/example.js";

zest.mock("../src/example.js", {
  add: (a, b) => {
    return a + b + 5;
  },
});

test("mocking replaces original functionality", () => {
  const addResult = add(2, 3);
  expect(addResult).toBe(10); // 2 + 3 + 5 from mock
});
