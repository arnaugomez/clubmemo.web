export interface PropsWithError {
  error: unknown;
}

export interface ErrorPageProps {
  error: unknown;
  reset: () => void;
}
