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
  create(tags: string[]): Promise<void>;
  /**
   * Gets a list of tags that resemble the query. For example, if que query is
   * "app", it could return "apple", "application", etc.
   *
   * @param query The query to search for tags.
   * @returns A list of tags that resemble the query.
   */
  getSuggestions(query?: string): Promise<string[]>;
}
