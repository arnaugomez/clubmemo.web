import { clientLocator } from "../di/client-locator";

export async function handlePromiseError<T>(
  promise: Promise<T>,
): Promise<T | undefined> {
  try {
    return await promise;
  } catch (e) {
    clientLocator.ErrorTrackingService().captureError(e);
  }
}
