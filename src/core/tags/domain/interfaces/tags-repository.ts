export interface TagsRepository {
  create(tags: string[]): Promise<void>;
  getSuggestions(query?: string): Promise<string[]>;
}
