// Types of the servidce locator
/**
 * A function that returns a dependency.
 */
export type Dependency<T> = () => T;
/**
 * A function that returns a promise that resolves to a dependency.
 */
export type Lazy<T> = () => Promise<T>;
