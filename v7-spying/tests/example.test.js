import * as example from "../src/example.js";

let addSpy;

test("spies on calls made to the function", () => {
  addSpy = zest.spyOn(example, "add");

  example.add(2, 3);

  expect(addSpy).toHaveBeenCalledWith(2, 3);
  expect(addSpy.calls.length).toBe(1);
});
