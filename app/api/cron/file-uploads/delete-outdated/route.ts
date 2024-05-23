import { locator } from "@/src/common/locator";

export async function GET() {
  const repository = await locator.FileUploadsRepository();
  await repository.deleteOutdated();
  return new Response("Cron job successful");
}
