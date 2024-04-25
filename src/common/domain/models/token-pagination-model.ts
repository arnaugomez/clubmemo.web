export interface TokenPaginationModelData<T> {
  results: T[];
  token?: string;
}

export class TokenPaginationModel<T> {
  constructor(readonly data: TokenPaginationModelData<T>) {}

  get results() {
    return this.data.results;
  }

  get token() {
    return this.data.token;
  }

  toData<U>(serializer: (data: T) => U): TokenPaginationModelData<U> {
    return {
      ...this.data,
      results: this.results.map(serializer),
    };
  }

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
