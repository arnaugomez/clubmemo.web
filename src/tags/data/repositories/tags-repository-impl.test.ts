import { DatabaseServiceImpl } from "@/src/common/data/services/database-service-impl";
import { locator } from "@/src/common/di/locator";
import { beforeEach, describe, expect, it } from "vitest";
import { tagsCollection } from "../collections/tags-collection";

describe("TagsRepositoryImpl", () => {
  beforeEach(async () => {
    locator.DatabaseService = () =>
      new DatabaseServiceImpl(locator.EnvService(), "ProfilesRepositoryImpl");
    const databaseService = locator.DatabaseService();
    await databaseService.collection(tagsCollection).deleteMany();
  });

  it("create creates a list of tags", async () => {
    const repository = await locator.TagsRepository();
    await repository.create(["tag1", "tag2", "tag3"]);
    const databaseService = locator.DatabaseService();
    const tagsCount = await databaseService
      .collection(tagsCollection)
      .countDocuments();
    expect(tagsCount).toBe(3);
    const tag1 = await databaseService.collection(tagsCollection).findOne({
      name: "tag1",
    });
    expect(tag1).not.toBeNull();
    expect(tag1?.name).toBe("tag1");

    const tag2 = await databaseService.collection(tagsCollection).findOne({
      name: "tag2",
    });
    expect(tag2).not.toBeNull();
    expect(tag2?.name).toBe("tag2");
  });

  it("create ignores repeated tags", async () => {
    const repository = await locator.TagsRepository();
    await repository.create(["tag1", "tag1", "tag7"]);
    await repository.create(["tag1"]);
    const databaseService = locator.DatabaseService();
    const tagsCount = await databaseService
      .collection(tagsCollection)
      .countDocuments();
    expect(tagsCount).toBe(2);
  });

  it("create does nothing when the argument is an empty array", async () => {
    const repository = await locator.TagsRepository();
    await repository.create([]);
    const databaseService = locator.DatabaseService();
    const tagsCount = await databaseService
      .collection(tagsCollection)
      .countDocuments();
    expect(tagsCount).toBe(0);
  });

  it("getSuggestions returns a list of tags that start with the query", async () => {
    const repository = await locator.TagsRepository();
    await repository.create([
      "apple",
      "banana",
      "application",
      "orange",
      "pear",
    ]);
    const suggestions = await repository.getSuggestions("app");
    expect(suggestions.sort()).toEqual(["apple", "application"]);

    const suggestions2 = await repository.getSuggestions("ora");
    expect(suggestions2).toEqual(["orange"]);

    const suggestions3 = await repository.getSuggestions("xxw");
    expect(suggestions3).toEqual([]);
  });

  it("getSuggestions returns a maximum of 5 suggestions", async () => {
    const repository = await locator.TagsRepository();
    await repository.create([
      "test1",
      "test2",
      "test3",
      "test4",
      "test5",
      "test6",
      "test7",
    ]);
    const suggestions = await repository.getSuggestions("test");
    expect(suggestions).toHaveLength(5);
  });

  it("getSuggestions returns all suggestions (but not more than 5) if the query is undefined or an empty string", async () => {
    const repository = await locator.TagsRepository();
    await repository.create(["test1", "test2", "test3", "test4"]);
    let suggestions = await repository.getSuggestions();
    expect(suggestions).toHaveLength(4);
    suggestions = await repository.getSuggestions("");
    expect(suggestions).toHaveLength(4);

    await repository.create(["test5", "test6", "test7"]);

    suggestions = await repository.getSuggestions();
    expect(suggestions).toHaveLength(5);
    suggestions = await repository.getSuggestions("");
    expect(suggestions).toHaveLength(5);
  });
});
