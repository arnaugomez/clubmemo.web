import { SortOrderModel } from "../../domain/models/sort-order-model";

export type SortOrderDataModel = 1 | -1;

export class SortOrderDataModelTransformer {
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
