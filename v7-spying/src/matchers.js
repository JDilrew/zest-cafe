const expect = (received) => ({
  toBe: (expected) => {
    if (received !== expected) {
      throw new Error(`Expected ${expected} but received ${received}.`);
    }
    return true;
  },
  toHaveBeenCalledWith(...expectedArgs) {
    if (typeof received !== "function" || !Array.isArray(received.calls)) {
      throw new Error(
        "Received value is not a spy function with call tracking"
      );
    }

    const matched = received.calls.some((call) => {
      return (
        call.length === expectedArgs.length &&
        call.every((arg, index) => arg === expectedArgs[index])
      );
    });

    if (!matched) {
      throw new Error(
        `Expected function to be called with ${JSON.stringify(
          expectedArgs
        )}, but it wasn't`
      );
    }
  },
});

export { expect };
