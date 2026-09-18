import * as Context from "effect/Context";
import type * as Effect from "effect/Effect";
import type { ExternalServiceError } from "@/src/common/effect/errors";
/**
 * Repository for tags.
 *
 * Tags are keywords that describe a certain topic or interest. They are used to
 * categorize and organize content, making it easier to search it. They are also
 * useful to recommend content to users that have shown interest in a certain
 * topic.
 */
export interface TagsRepository {
  /**
   * Adds a list of tags to the external data persistence system. If a tag
   * already exists, it is ignored.
   *
   * @param tags A list of tags to create.
   */
  create(tags: string[]): Effect.Effect<void, ExternalServiceError>;
  /**
   * Gets a list of tags that resemble the query. For example, if que query is
   * "app", it could return "apple", "application", etc.
   *
   * @param query The query to search for tags.
   * @returns A list of tags that resemble the query.
   */
  getSuggestions(query?: string): Effect.Effect<string[], ExternalServiceError>;
}

export const TagsRepository = Context.Service<TagsRepository>(
  "clubmemo/tags/domain/interfaces/tags-repository/TagsRepository",
);
