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
}
