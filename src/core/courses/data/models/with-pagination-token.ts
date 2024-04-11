import { TokenPaginationModel } from "@/src/core/common/domain/models/token-pagination-model";

export type WithPaginationToken<T extends object> = T & {
  paginationToken: string;
};

export class TokenPaginationTransformer<T extends object> {
  constructor(private readonly docs: WithPaginationToken<T>[]) {}

  toDomain<U>(mapper: (doc: T) => U) {
    return new TokenPaginationModel({
      results: this.docs.map(mapper),
      token: this.docs[this.docs.length - 1]?.paginationToken,
    });
  }
}
