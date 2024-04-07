declare namespace NodeJS {
  export interface ProcessEnv {
    /** The MongoDB URL, used to connect to the database */
    readonly MONGODB_URL: string;
    /** Whether to send real emails or log them to the console */
    readonly SEND_EMAIL: string;
    /** The Resend api key, used to send emails */
    readonly RESEND_API_KEY: string;
    /** The base url of the website */
    readonly BASE_URL: string;
    /**
     * Pepper code for the password hashing algorithm.
     * Adds an extra layer of protection to the password hash.
     * It prevents the hash from being cracked even if it is leaked.
     */
    readonly PASSWORD_PEPPER: string;
    /** OpenAI API key */
    readonly OPENAI_API_KEY: string;
    /** Whether to use a fake of the OpenAI API to save money */
    readonly FAKE_OPENAI_API: string;
  }
}
