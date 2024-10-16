import type { Dependency } from "@/src/common/di/locator-types";
import { locator_common_DatabaseService } from "@/src/common/locators/locator_database-service";
import { TagsRepositoryImpl } from "../data/repositories/tags-repository-impl";
import type { TagsRepository } from "../domain/interfaces/tags-repository";

export const locator_tags_TagsRepository: Dependency<TagsRepository> = () =>
  new TagsRepositoryImpl(locator_common_DatabaseService());
