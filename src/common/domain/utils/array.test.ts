import range from "lodash/range";
import { describe, expect, it } from "vitest";
import { shuffle } from "./array";

describe("shuffle", () => {
  it("should return an array of the same length", () => {
    const array = range(1, 11);
    const shuffledArray = shuffle(array);
    expect(shuffledArray).toHaveLength(array.length);
  });

  it("should contain the same elements", () => {
    const array = range(1, 43);
    const shuffledArray = shuffle(array);
    expect(shuffledArray.sort()).toEqual(array.sort());
  });
});
