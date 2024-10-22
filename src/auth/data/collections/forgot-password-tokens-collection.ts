import { collection } from "@/src/common/data/utils/mongodb";
import type { ObjectId, WithId } from "mongodb";
import { ForgotPasswordTokenModel } from "../../domain/models/forgot-password-token-model";

/**
 * MongoDB document for forgot password tokens, used to re-set the password of a
 * user in case it was forgotten.
 */
export interface ForgotPasswordTokenDoc {
  /** Id of the user that forgot the password */
  userId: ObjectId;
  /** Do not store the original token in the DB, store a hash instead */
  tokenHash: string;
  /** Expiration date of the token */
  expiresAt: Date;
}

/**
 * Collection of MongoDB documents of type `ForgotPasswordTokenDoc`
 */
export const forgotPasswordTokensCollection =
  collection<ForgotPasswordTokenDoc>()("forgotPasswordTokens");

/**
 * Transforms a `ForgotPasswordTokenDoc` object from the Data layer to a
 * `ForgotPasswordTokenModel` instance of the Domain layer.
 */
export class ForgotPasswordTokenDocTransformer {
  constructor(private readonly doc: WithId<ForgotPasswordTokenDoc>) {}

  /**
   * @returns A `ForgotPasswordTokenModel` object of the domain layer
   * with the data of the current `ForgotPasswordTokenDoc` object
   */
  toDomain(): ForgotPasswordTokenModel {
    return new ForgotPasswordTokenModel({
      userId: this.doc.userId.toString(),
      expiresAt: this.doc.expiresAt,
    });
  }
}
