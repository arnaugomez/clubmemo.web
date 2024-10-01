import { locator } from "@/src/common/di/locator";
import type { Dependency } from "@/src/common/di/locator-types";
import { TagsRepositoryImpl } from "../data/repositories/tags-repository-impl";
import type { TagsRepository } from "../domain/interfaces/tags-repository";

export const locator_tags_TagsRepository: Dependency<TagsRepository> = () =>
  new TagsRepositoryImpl(locator.DatabaseService());
