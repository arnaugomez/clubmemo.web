/**
 * Data of a paginated list of items with a token to fetch the next page.
 */
export interface TokenPaginationModelData<T> {
  results: T[];
  token?: string;
}

/**
 * A paginated list of items with a token to fetch the next page. Contains a
 * portion of the results of a query and a token that identifies the last item
 * in the list, which can be used to get the next items.
 */
export class TokenPaginationModel<T> {
  constructor(private readonly data: TokenPaginationModelData<T>) {}

  /**
   * The list of items in the current page.
   */
  get results() {
    return this.data.results;
  }

  /**
   * The identifier of the last item in the `results` list. Used as a token to
   * fetch the next page of items.
   */
  get token() {
    return this.data.token;
  }

  /**
   * Serializes the paginated list
   *
   * @param serializer Function that converts an item in the `results` list to a serializable format.
   * @returns A serialized version of the paginated list.
   */
  toData<U>(serializer: (data: T) => U): TokenPaginationModelData<U> {
    return {
      ...this.data,
      results: this.results.map(serializer),
    };
  }

  /**
   * Deserializes the paginated list
   *
   * @param serializer Function that converts a serialized item in the `results` list to a domain model
   * @returns The original paginated list deserialized.
   */
  static fromData<T, U>(
    data: TokenPaginationModelData<U>,
    deserializer: (data: U) => T,
  ): TokenPaginationModel<T> {
    return new TokenPaginationModel<T>({
      ...data,
      results: data.results.map(deserializer),
    });
  }
}
