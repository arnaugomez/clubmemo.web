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

  /**
   * Creates an empty pagination model.
   *
   * @returns An empty pagination model
   */
  static empty<T>(): PaginationModel<T> {
    return new PaginationModel<T>({
      results: [],
      totalCount: 0,
    });
  }

  /**
   * Creates a serialized version of the pagination model.
   *
   * @param serializer Function to serialize the elements of the results list
   * @returns A serialized version of the pagination model
   */
  toData<U>(serializer: (data: T) => U): PaginationModelData<U> {
    return {
      results: this.results.map(serializer),
      totalCount: this.totalCount,
    };
  }

  /**
   * Creates a new pagination model from serialized data.
   *
   * @param data Serialized data
   * @param deserializer Function that transforms a serialized element into the original type
   * @returns A pagination model with the deserialized elements
   */
  static fromData<T, U>(
    data: PaginationModelData<U>,
    deserializer: (data: U) => T,
  ): PaginationModel<T> {
    return new PaginationModel<T>({
      results: data.results.map(deserializer),
      totalCount: data.totalCount,
    });
  }
}
