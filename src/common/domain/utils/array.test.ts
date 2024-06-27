import { describe, expect, it } from "vitest";
import { shuffle } from "./array";

const createArray = (length: number) => Array.from({ length }, (_, i) => i);

describe("shuffle", () => {
  it("should return an array of the same length", () => {
    const array = createArray(10);
    const shuffledArray = shuffle(array);
    expect(shuffledArray).toHaveLength(array.length);
  });

  it("should contain the same elements", () => {
    const array = createArray(42);
    const shuffledArray = shuffle(array);
    expect(shuffledArray.sort()).toEqual(array.sort());
  });
});
