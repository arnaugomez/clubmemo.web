import * as Config from "effect/Config";
import * as Redacted from "effect/Redacted";

const optionalSecret = (name: string) =>
  Config.Redacted(name).pipe(Config.withDefault(Redacted.make("")));
const flag = (name: string) =>
  Config.String(name).pipe(
    Config.withDefault("false"),
    Config.map((value) => value === "true"),
  );

/** Validated process configuration; optional integrations are acquired when used. */
export const applicationConfig = Config.all({
  mongodbUrl: Config.Redacted("MONGODB_URL"),
  projectUrl: Config.NonEmptyString("PROJECT_URL"),
  passwordPepper: Config.Redacted("PASSWORD_PEPPER"),
  resendApiKey: optionalSecret("RESEND_API_KEY"),
  openaiApiKey: optionalSecret("OPENAI_API_KEY"),
  sendEmail: flag("SEND_EMAIL"),
  fakeOpenAiApi: flag("FAKE_OPENAI_API"),
  awsRegion: Config.String("AWS_REGION").pipe(Config.withDefault("")),
  awsBucketName: Config.String("AWS_BUCKET_NAME").pipe(Config.withDefault("")),
  adminEmail: Config.String("ADMIN_EMAIL").pipe(Config.withDefault("")),
});
