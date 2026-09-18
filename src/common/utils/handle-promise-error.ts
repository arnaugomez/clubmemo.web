import { captureError } from "@/src/common/effect/client-runtime";

export async function handlePromiseError<T>(
  promise: Promise<T>,
): Promise<T | undefined> {
  try {
    return await promise;
  } catch (e) {
    captureError(e);
  }
}
