import { unstable_cache } from "next/cache";
import { cache } from "react";
import { waitMilliseconds } from "../../../core/app/utils/promises";

// Important It is important to use both unstable_cache and react cache
// react cache is used to not repeat the same request twice or three times. It caches the result of the function once per request.
// unstable_cache is used by the Next.js framework to cache the result of the promise until the next revalidation.

const fetchRandomNumber1 = cache(async () => {
  console.log("fetching random number");
  await waitMilliseconds(2000);
  return Math.random();
});

export const fetchRandomNumber = unstable_cache(
  async () => {
    return await fetchRandomNumber1();
  },
  ["random-number"],
  { tags: ["random-number"] },
);
