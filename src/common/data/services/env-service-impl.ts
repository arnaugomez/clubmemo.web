import type { EnvService } from "../../domain/interfaces/env-service";

/**
 * Implementation of `EnvService` using process.env to read the environment variables
 */
export class EnvServiceImpl implements EnvService {
  readonly mongodbUrl = process.env.MONGODB_URL;
  readonly resendApiKey = process.env.RESEND_API_KEY;
  readonly sendEmail = process.env.SEND_EMAIL === "true";
  readonly projectUrl = process.env.PROJECT_URL;
  readonly passwordPepper = process.env.PASSWORD_PEPPER;
  readonly openaiApiKey = process.env.OPENAI_API_KEY;
  readonly fakeOpenAiApi = process.env.FAKE_OPENAI_API === "true";
  readonly awsRegion = process.env.AWS_REGION;
  readonly awsBucketName = process.env.AWS_BUCKET_NAME;
  readonly adminEmail = process.env.ADMIN_EMAIL ?? "";
  readonly isProduction = process.env.NODE_ENV === "production";
}
