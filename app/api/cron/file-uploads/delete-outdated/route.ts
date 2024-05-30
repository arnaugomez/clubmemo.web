import { locator } from "@/src/common/di/locator";
import { ApiErrorHandler } from "@/src/common/ui/api/api-error-handler";

export async function GET() {
  try {
    const repository = await locator.FileUploadsRepository();
    await repository.deleteOutdated();
    return new Response("Cron job successful");
  } catch (e) {
    return ApiErrorHandler.handle(e);
  }
}
