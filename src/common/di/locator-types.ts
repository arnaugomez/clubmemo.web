export type Dependency<T> = () => T;
export type Lazy<T> = () => Promise<T>;
