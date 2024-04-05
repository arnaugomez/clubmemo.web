export interface PaginationModelData<T> {
  results: T[];
  totalCount: number;
}

export class PaginationModel<T> {
  constructor(public readonly data: PaginationModelData<T>) {}

  get results() {
    return this.data.results;
  }

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
