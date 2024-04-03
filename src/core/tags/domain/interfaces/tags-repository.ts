export interface TagsRepository {
  create(tags: string[]): Promise<void>;
}
