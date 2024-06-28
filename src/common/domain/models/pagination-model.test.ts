import { describe, expect, it } from "vitest";
import type { PaginationModelData } from "./pagination-model";
import { PaginationModel } from "./pagination-model";

describe("PaginationModel", () => {
  const paginationModel = new PaginationModel({
    results: [1, 2, 3],
    totalCount: 10,
  });

  it("results contains the elements of the paginated list", () => {
    expect(paginationModel.results).toEqual([1, 2, 3]);
  });

  it("totalCount matches data", () => {
    expect(paginationModel.totalCount).toEqual(10);
  });

  it("toData serializes the elements of the results list", () => {
    const serialized = paginationModel.toData((data) => data.toString());
    expect(serialized.results).toEqual(["1", "2", "3"]);
    expect(serialized.totalCount).toEqual(10);
  });

  it("fromData deserializes the elements of the results list", () => {
    const serialized: PaginationModelData<string> = {
      results: ["1", "2", "3"],
      totalCount: 10,
    };
    expect(
      PaginationModel.fromData(serialized, (element) => parseInt(element))
        .results,
    ).toEqual([1, 2, 3]);
    expect(serialized.totalCount).toEqual(10);
  });

  it("empty returns an empty pagination model", () => {
    const empty = PaginationModel.empty();
    expect(empty.results).toEqual([]);
    expect(empty.totalCount).toEqual(0);
  });
});
