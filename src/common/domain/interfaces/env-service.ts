export interface EnvService {
  /** The MongoDB URL, used to connect to the database */
  readonly mongodbUrl: string;
  /** Whether to send real emails or log them to the console */
  readonly sendEmail: boolean;
  /** The Resend api key, used to send emails */
  readonly resendApiKey: string;
  /** The base url of the website, for example, https://example.com */
  readonly baseUrl: string;
  /**
   * Pepper code for the password hashing algorithm.
   * Adds an extra layer of protection to the password hash.
   * It prevents the hash from being cracked even if it is leaked.
   */
  readonly passwordPepper: string;
  /** OpenAI API key */
  readonly openaiApiKey: string;

  /** Whether to use a fake of the OpenAI API to save money */
  readonly fakeOpenAiApi: boolean;

  /** The AWS region code of the S3 bucket */
  readonly awsRegion: string;

  /** The unique identifier of the AWS S3 bucket */
  readonly awsBucketName: string;
}
