/**
 * Memoizes the result of a function.
 * @param fn The function to memoize.
 * @returns The memoized function.
 */
export function singleton<T>(fn: () => T ) {
  let isCached = false;
  let cachedResult: T;
  return () => {
    if (!isCached) {
      isCached = true;
      cachedResult = fn();
    }
    return cachedResult;
  }
}