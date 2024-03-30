import { fetchRandomNumber } from "@/src/ui/features/random-number/fetch-random-number";
import { RandomNumberSection } from "@/src/ui/features/random-number/random-number";
import { RandomNumberResult } from "@/src/ui/features/random-number/random-number-result";
import { Suspense } from "react";

// This is a demo
export default async function RandomNumberPage() {
  fetchRandomNumber(); // Although it is called here and in the RandomNumberResult component, it is only called once. The second time it is called, it returns the cached result. This is thanks to the React.cache function
  const suspenseKey = Math.random();

  return (
    <>
      {/* If you don't do suspense, it behaves in a SWR way. It shows stale data until the fresh new data is available (and, of course, it shows no loading screen). If you want a swr-like behaviour it is fine, but if you want a loading screen you should use Suspense. */}
      {/* Also, notice the "key", changing it is necessary to re-trigger the fallback of the suspense. Otherwise, it also behaves in the swr way. */}
      <Suspense key={suspenseKey} fallback="Loading...">
        <RandomNumberResult />
      </Suspense>
      <RandomNumberSection />
    </>
  );
}
