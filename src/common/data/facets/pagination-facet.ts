import { PaginationModel } from "../../domain/models/pagination-model";

/**
 * Query result of the database that includes pagination metadata.
 */
export interface PaginationFacet<T> {
  metadata: {
    totalCount: number;
  };
  results: T[];
}

/**
 * Transforms a pagination facet into a domain model.
 */
export class PaginationFacetTransformer<T> {
  constructor(private readonly facet: PaginationFacet<T>) {}
  toDomain<S>(mapFn: (data: T) => S): PaginationModel<S> {
    return new PaginationModel({
      results: this.facet.results.map(mapFn),
      totalCount: this.facet.metadata.totalCount,
    });
  }
}
