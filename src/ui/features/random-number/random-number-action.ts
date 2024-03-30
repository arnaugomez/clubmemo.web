"use server";

import { revalidateTag } from "next/cache";

export async function randomNumberAction() {
  revalidateTag("random-number"); // You could also do revalidatePath("/random-number")
  // revalidatePath("/random-number");
}
