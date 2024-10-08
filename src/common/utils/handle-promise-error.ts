import { locator_common_ErrorTrackingService } from "../locators/locator_error-tracking-service";

export async function handlePromiseError<T>(
  promise: Promise<T>,
): Promise<T | undefined> {
  try {
    return await promise;
  } catch (e) {
    locator_common_ErrorTrackingService().captureError(e);
  }
}
