import { locator } from "@/src/common/di/locator";
import { ApiErrorHandler } from "@/src/common/ui/api/api-error-handler";

/**
 * Deletes all the files from the external storage service that are no longer in
 * use. It is expected to be called frequently by a cron job process.
 */
export async function GET() {
  try {
    const repository = await locator.FileUploadsRepository();
    await repository.deleteOutdated();
    return new Response("Cron job successful");
  } catch (e) {
    return ApiErrorHandler.handle(e);
  }
}
