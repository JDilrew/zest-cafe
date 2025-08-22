function spyOn(obj, key) {
  const original = obj[key];
  if (typeof original !== "function") {
    throw new TypeError(`${key} is not a function`);
  }

  function spy(...args) {
    spy.calls.push(args);
    return original.apply(this, args);
  }

  spy.calls = [];
  spy.mockRestore = () => (obj[key] = original);

  obj[key] = spy;
  return spy;
}

export { spyOn };
