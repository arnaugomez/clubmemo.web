import { describe, expect, it } from "vitest";
import { TokenPaginationModel } from "./token-pagination-model";

describe("TokenPaginationModel", () => {
  it("properties match value", () => {
    const data = { results: [1, 2, 3], token: "test-token-134" };
    const model = new TokenPaginationModel(data);
    expect(model.results).toEqual(data.results);
    expect(model.token).toEqual(data.token);
  });

  it("toData serializes data", () => {
    const data = { results: [1, 2, 3], token: "testToken" };
    const model = new TokenPaginationModel(data);
    const serializedData = model.toData((num: number) => num.toString());
    expect(serializedData).toEqual({
      token: data.token,
      results: ["1", "2", "3"],
    });
  });

  it("fromData deserializes data", () => {
    const data = { results: ["1", "2", "3"], token: "testToken" };
    const model = TokenPaginationModel.fromData(data, (str: string) =>
      parseInt(str),
    );
    expect(model.results).toEqual([1, 2, 3]);
    expect(model.token).toEqual(data.token);
  });
});
