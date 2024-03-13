import { User } from "lucia";
import { ObjectId } from "mongodb";
import { TimeSpan, createDate, isWithinExpirationDate } from "oslo";
import { alphabet, generateRandomString } from "oslo/crypto";
import { waitMilliseconds } from "./core/app/utils/promises";
import { locator } from "./core/app/locator";

interface EmailVerificationCodeDoc {
  userId: ObjectId;
  code: string;
  expiresAt: Date;
}

const db = locator.MongoService().db;
export const emailVerificationCodesCollection =
  db.collection<EmailVerificationCodeDoc>("emailVerificationCodes");

export async function generateEmailVerificationCode(userId: ObjectId) {
  await emailVerificationCodesCollection.deleteMany({ userId });
  const code = generateRandomString(6, alphabet("0-9"));
  await emailVerificationCodesCollection.insertOne({
    userId,
    code,
    expiresAt: createDate(new TimeSpan(10, "m")),
  });
  return code;
}

export async function verifyEmailVerificationCode(
  user: User,
  code: string,
): Promise<boolean> {
  const databaseCode = await emailVerificationCodesCollection.findOne({
    userId: user.id,
  });
  if (!databaseCode || databaseCode.code !== code) {
    await waitMilliseconds(2000); // Prevent brute-force attacks
    return false;
  }
  await emailVerificationCodesCollection.deleteOne({ _id: databaseCode._id });

  if (!isWithinExpirationDate(databaseCode.expiresAt)) {
    return false;
  }
  return true;
}
