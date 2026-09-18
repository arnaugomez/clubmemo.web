import { randomUUID } from "node:crypto";
import * as Effect from "effect/Effect";
import * as Layer from "effect/Layer";
import { DatabaseIndexesServiceImpl } from "@/src/common/data/services/database-indexes-service-impl";
import { DatabaseServiceImpl } from "@/src/common/data/services/database-service-impl";
import { applicationConfig } from "@/src/common/data/services/env-service-impl";
import { DatabaseService } from "@/src/common/domain/interfaces/database-service";

/** Each suite owns its database, including indexes, and removes only its data. */
export const testDatabaseLayer = Layer.effect(
  DatabaseService,
  Effect.gen(function* () {
    const config = yield* applicationConfig;
    const name = `cm_e_${randomUUID().replaceAll("-", "")}`;
    const collections = new Set<string>();
    const database = yield* Effect.acquireRelease(
      Effect.sync(() => {
        const database = new DatabaseServiceImpl(config, name);
        const collection = database.collection.bind(database);
        database.collection = (type) => {
          collections.add(type.name);
          return collection(type);
        };
        return database;
      }),
      (database) =>
        Effect.promise(async () => {
          try {
            // Drop only collections created by this suite; the test role forbids dropDatabase.
            await Promise.all(
              [...collections].map((collection) =>
                database.client.db(name).collection(collection).drop(),
              ),
            );
          } finally {
            await database.client.close();
          }
        }),
    );
    yield* new DatabaseIndexesServiceImpl(database).createIndexes();
    return database;
  }),
);
