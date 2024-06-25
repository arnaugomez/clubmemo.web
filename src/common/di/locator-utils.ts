import memoizeOne from "memoize-one";

/**
 * Memoizes the result of a function.
 * @param resultFn The function to memoize.
 * @returns The memoized function.
 */
export const singleton = memoizeOne;
