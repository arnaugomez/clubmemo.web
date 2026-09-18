import * as Effect from "effect/Effect";
import * as Layer from "effect/Layer";
import * as ManagedRuntime from "effect/ManagedRuntime";
import { afterAll } from "vitest";
import { DatabaseService } from "@/src/common/domain/interfaces/database-service";
import { testDatabaseLayer } from "@/test/utils/database";
import {
  TagsRepository,
  TagsRepositoryLive,
} from "../../layers/layer_tags-repository";

const runtime = ManagedRuntime.make(
  TagsRepositoryLive.pipe(Layer.provideMerge(testDatabaseLayer)),
);
afterAll(() => runtime.dispose());

import { beforeEach, describe, expect, it } from "vitest";
import { tagsCollection } from "../collections/tags-collection";

describe("TagsRepositoryImpl", () => {
  beforeEach(async () => {
    const databaseService = await runtime.runPromise(DatabaseService);
    await databaseService.collection(tagsCollection).deleteMany();
  });

  it("create creates a list of tags", async () => {
    const repository = await runtime.runPromise(TagsRepository);
    await Effect.runPromise(repository.create(["tag1", "tag2", "tag3"]));
    const databaseService = await runtime.runPromise(DatabaseService);
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
    const repository = await runtime.runPromise(TagsRepository);
    await Effect.runPromise(repository.create(["tag1", "tag1", "tag7"]));
    await Effect.runPromise(repository.create(["tag1"]));
    const databaseService = await runtime.runPromise(DatabaseService);
    const tagsCount = await databaseService
      .collection(tagsCollection)
      .countDocuments();
    expect(tagsCount).toBe(2);
  });

  it("create does nothing when the argument is an empty array", async () => {
    const repository = await runtime.runPromise(TagsRepository);
    await Effect.runPromise(repository.create([]));
    const databaseService = await runtime.runPromise(DatabaseService);
    const tagsCount = await databaseService
      .collection(tagsCollection)
      .countDocuments();
    expect(tagsCount).toBe(0);
  });

  it("getSuggestions returns a list of tags that start with the query", async () => {
    const repository = await runtime.runPromise(TagsRepository);
    await Effect.runPromise(
      repository.create(["apple", "banana", "application", "orange", "pear"]),
    );
    const suggestions = await Effect.runPromise(
      repository.getSuggestions("app"),
    );
    expect(suggestions.sort()).toEqual(["apple", "application"]);

    const suggestions2 = await Effect.runPromise(
      repository.getSuggestions("ora"),
    );
    expect(suggestions2).toEqual(["orange"]);

    const suggestions3 = await Effect.runPromise(
      repository.getSuggestions("xxw"),
    );
    expect(suggestions3).toEqual([]);
  });

  it("getSuggestions returns a maximum of 5 suggestions", async () => {
    const repository = await runtime.runPromise(TagsRepository);
    await Effect.runPromise(
      repository.create([
        "test1",
        "test2",
        "test3",
        "test4",
        "test5",
        "test6",
        "test7",
      ]),
    );
    const suggestions = await Effect.runPromise(
      repository.getSuggestions("test"),
    );
    expect(suggestions).toHaveLength(5);
  });

  it("getSuggestions returns all suggestions (but not more than 5) if the query is undefined or an empty string", async () => {
    const repository = await runtime.runPromise(TagsRepository);
    await Effect.runPromise(
      repository.create(["test1", "test2", "test3", "test4"]),
    );
    let suggestions = await Effect.runPromise(repository.getSuggestions());
    expect(suggestions).toHaveLength(4);
    suggestions = await Effect.runPromise(repository.getSuggestions(""));
    expect(suggestions).toHaveLength(4);

    await Effect.runPromise(repository.create(["test5", "test6", "test7"]));

    suggestions = await Effect.runPromise(repository.getSuggestions());
    expect(suggestions).toHaveLength(5);
    suggestions = await Effect.runPromise(repository.getSuggestions(""));
    expect(suggestions).toHaveLength(5);
  });
});
