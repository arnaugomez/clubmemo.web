/**
 * Serialized data of `PaginationModel`
 */
export interface PaginationModelData<T> {
  results: T[];
  totalCount: number;
}

/**
 * A paginated list. Contains a fraction of the results of a query.
 * It also contains the total count of the results.
 */
export class PaginationModel<T> {
  constructor(public readonly data: PaginationModelData<T>) {}

  /**
   * Elements of the paginated list
   */
  get results() {
    return this.data.results;
  }

  /**
   * Total count of the results of the query.
   * It is equal or larger than the length of the results list.
   */
  get totalCount() {
    return this.data.totalCount;
  }

  static empty<T>(): PaginationModel<T> {
    return new PaginationModel<T>({
      results: [],
      totalCount: 0,
    });
  }

  toData<U>(serializer: (data: T) => U): PaginationModelData<U> {
    return {
      ...this.data,
      results: this.results.map(serializer),
    };
  }

  static fromData<T, U>(
    data: PaginationModelData<U>,
    deserializer: (data: U) => T,
  ): PaginationModel<T> {
    return new PaginationModel<T>({
      ...data,
      results: data.results.map(deserializer),
    });
  }
}
