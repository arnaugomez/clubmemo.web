import { describe, expect, it } from "vitest";
import { collection } from "./mongodb";

interface MockDoc {
  foo: string;
  bar: number;
}

describe("collection", () => {
  it("should return an object with the correct name property", () => {
    const collectionName = "testCollection";
    const result = collection<MockDoc>()(collectionName);
    expect(result.name).toBe(collectionName);
  });
});
