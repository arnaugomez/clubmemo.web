import { SortOrderModel } from "../../domain/models/sort-order-model";

/**
 * Representation of the sort order in the MongoDB database queries
 */
export type SortOrderDataModel = 1 | -1;

/**
 * Transforms the sort order from the domain model into a MongoDB-compatible
 * representation to be used in database queries
 */
export class SortOrderDataModelTransformer {
  /**
   * Transforms the sort order from the domain model into a MongoDB-compatible
   * representation to be used in database queries
   * @param sortOrder The sort order in the domain model
   * @returns The MongoDB-compatible representation of the sort order
   */
  static fromDomainModel(
    sortOrder?: SortOrderModel,
  ): SortOrderDataModel | undefined {
    switch (sortOrder) {
      case SortOrderModel.ascending:
        return 1;
      case SortOrderModel.descending:
        return -1;
      default:
        return undefined;
    }
  }
}
