import * as Effect from "effect/Effect";

/** Promise boundary for React callbacks that retain their existing UI delay. */
export const waitMilliseconds = (ms: number): Promise<void> =>
  Effect.runPromise(Effect.sleep(ms));
