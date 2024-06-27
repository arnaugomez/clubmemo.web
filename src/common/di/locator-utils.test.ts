import { describe, expect, it } from "vitest";
import { singleton } from "./locator-utils";

describe("singleton", () => {
  it("should always return the same result", () => {
    const memoizedFn = singleton(() => "test1");
    const result1 = memoizedFn();
    const result2 = memoizedFn();
    const result3 = memoizedFn();

    expect(result1).toBe("test1");
    expect(result1).toBe(result2);
    expect(result2).toBe(result3);

    const memoizedFn2 = singleton(() => Symbol("test1"));
    const result4 = memoizedFn2();
    const result5 = memoizedFn2();
    expect(result4).toBe(result5);
  });

  it("should always return the same result when the function is asynchronous", async () => {
    const memoizedFn = singleton(async () => Symbol("test2"));
    const result1 = await memoizedFn();
    const result2 = await memoizedFn();
    const result3 = await memoizedFn();

    expect(result1).toBe(result2);
    expect(result2).toBe(result3);
  });
});
