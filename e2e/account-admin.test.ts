import { createHash, randomUUID } from "node:crypto";
import { expect, test } from "@playwright/test";
import { MongoClient, ObjectId } from "mongodb";
import { Argon2id } from "oslo/password";
import { testSetting } from "./environment";

test("permissions, administration, enrollment, recovery and account deletion", async ({
  page,
}) => {
  test.setTimeout(600_000);
  const client = new MongoClient(testSetting("MONGODB_URL"));
  await client.connect();
  const db = client.db();
  const suffix = randomUUID().replaceAll("-", "").slice(0, 12);
  const email = `effect-admin-${suffix}@test.com`;
  const userId = new ObjectId();
  const profileId = new ObjectId();
  const courseId = new ObjectId();
  const password = "test-password-123";
  const hashing = new Argon2id({
    secret: new TextEncoder().encode(testSetting("PASSWORD_PEPPER")),
  });
  await db.collection("users").insertOne({
    _id: userId,
    email,
    hashed_password: await hashing.hash(password),
    authTypes: ["email"],
    isEmailVerified: true,
    isAdmin: false,
    acceptTerms: true,
  });
  await db
    .collection("profiles")
    .insertOne({ _id: profileId, userId, isPublic: false });
  await db
    .collection("courses")
    .insertOne({ _id: courseId, name: `Public ${suffix}`, isPublic: true });
  const privateId = (
    await db
      .collection("courses")
      .insertOne({ name: `Private ${suffix}`, isPublic: false })
  ).insertedId;
  const login = async (value: string) => {
    await page.goto("/auth/login");
    await page.getByTestId("email").fill(email);
    await page.getByTestId("password").fill(value);
    await page.getByTestId("submit").click();
    await expect(page).toHaveURL(/\/home$/);
  };
  try {
    await login(password);
    await test.step("enforces private-course and administrator access", async () => {
      await page.goto("/admin");
      await expect(page).toHaveURL(/\/home$/);
      const response = await page.goto(`/courses/detail/${privateId}`);
      await expect(
        page.getByRole("heading", { name: `Private ${suffix}`, exact: true }),
      ).toHaveCount(0);
      expect(response?.status()).toBe(404);
    });
    await test.step("enroll, copy, delete copy and unenroll", async () => {
      await page.goto(`/courses/detail/${courseId}`);
      await page.getByRole("button", { name: "Unirme al curso" }).click();
      await expect
        .poll(() =>
          db
            .collection("courseEnrollments")
            .countDocuments({ profileId, courseId }),
        )
        .toBe(1);
      await page.reload();
      await page.getByRole("button", { name: "Opciones del curso" }).click();
      await page.getByRole("menuitem", { name: "Copiar", exact: true }).click();
      await page.getByRole("button", { name: "Iniciar copia" }).click();
      await expect(page).not.toHaveURL(new RegExp(String(courseId)));
      await expect(page).toHaveURL(/\/courses\/detail\/[a-f0-9]+$/);
      await page.getByRole("button", { name: "Opciones del curso" }).click();
      await page.getByRole("menuitem", { name: "Eliminar curso" }).click();
      await page
        .getByRole("dialog")
        .getByRole("button", { name: "Eliminar", exact: true })
        .click();
      await expect(page).toHaveURL(/\/courses$/);
      await page.goto(`/courses/detail/${courseId}`);
      await page.getByRole("button", { name: "Opciones del curso" }).click();
      await page.getByRole("menuitem", { name: "Desapuntarme" }).click();
      await page
        .getByRole("dialog")
        .getByRole("button", { name: "Desapuntarme" })
        .click();
      await expect(
        page.getByRole("button", { name: "Unirme al curso" }),
      ).toBeVisible();
      expect(
        await db
          .collection("courseEnrollments")
          .countDocuments({ profileId, courseId }),
      ).toBe(0);
    });
    await test.step("admin resource create, update, search and delete", async () => {
      await db
        .collection("users")
        .updateOne({ _id: userId }, { $set: { isAdmin: true } });
      await page.goto("/admin/resources/tags/create");
      await page
        .getByLabel("Nombre (name)", { exact: true })
        .fill(`effecttag${suffix}`);
      await page
        .getByRole("button", { name: "Crear etiqueta", exact: true })
        .click();
      await expect(page).toHaveURL(
        /\/admin\/resources\/tags\/detail\/[a-f0-9]+$/,
      );
      await page
        .getByLabel("Nombre (name)", { exact: true })
        .fill(`effecttag${suffix}edited`);
      await page
        .getByRole("button", { name: "Modificar Etiqueta", exact: true })
        .click();
      await expect
        .poll(() =>
          db
            .collection("tags")
            .countDocuments({ name: `effecttag${suffix}edited` }),
        )
        .toBe(1);
      await page
        .getByRole("button", { name: "Eliminar Etiqueta", exact: true })
        .click();
      await page
        .getByRole("dialog")
        .getByRole("button", { name: "Eliminar", exact: true })
        .click();
      await expect(page).toHaveURL(/\/admin\/resources\/tags$/);
      expect(
        await db
          .collection("tags")
          .countDocuments({ name: `effecttag${suffix}edited` }),
      ).toBe(0);
    });
    await test.step("forgot password and one-time password recovery", async () => {
      await page.goto("/settings");
      await page.getByRole("button", { name: "Cerrar sesión y salir" }).click();
      await expect(page).not.toHaveURL(/\/settings$/);
      await page.goto("/auth/forgot-password");
      await page.getByTestId("email").fill(email);
      await page.getByTestId("submit").click();
      await expect(
        page.getByRole("heading", { name: "Correo enviado" }),
      ).toBeVisible();
      // Email is disabled in browser tests. Replace only this user's hashed token
      // with a known value, then exercise the public reset endpoint and real hashing.
      const token = randomUUID();
      const result = await db.collection("forgotPasswordTokens").updateOne(
        { userId },
        {
          $set: {
            tokenHash: createHash("sha256").update(token).digest("hex"),
          },
        },
      );
      expect(result.matchedCount).toBe(1);
      await page.goto(
        `/auth/reset-password?email=${encodeURIComponent(email)}&token=${token}`,
      );
      await page
        .getByLabel("Contraseña", { exact: true })
        .fill("reset-password-123");
      await page
        .getByLabel("Repetir contraseña", { exact: true })
        .fill("reset-password-123");
      await page.getByTestId("submit").click();
      await expect(
        page.getByRole("heading", { name: "Contraseña modificada" }),
      ).toBeVisible();
      expect(
        await db.collection("forgotPasswordTokens").countDocuments({ userId }),
      ).toBe(0);
      await login("reset-password-123");
    });
    await test.step("delete account through its confirmation form", async () => {
      await page.goto("/settings");
      await page
        .getByRole("button", { name: "Eliminar mi cuenta", exact: true })
        .click();
      await page
        .getByLabel("Contraseña", { exact: true })
        .fill("reset-password-123");
      await page
        .getByLabel("Escribe tu correo electrónico para confirmar")
        .fill(email);
      await page
        .getByRole("button", { name: "Eliminar mi usuario", exact: true })
        .click();
      await expect(page).toHaveURL(/\/auth\/signup$/);
      expect(await db.collection("users").countDocuments({ _id: userId })).toBe(
        0,
      );
    });
  } catch (error) {
    console.error(
      "Account journey page",
      page.url(),
      await page.locator("body").innerText(),
    );
    await page.screenshot({
      path: "test-results/account-failure.png",
      fullPage: true,
    });
    throw error;
  } finally {
    const permissions = await db
      .collection("coursePermissions")
      .find({ profileId })
      .toArray();
    const courseIds = [
      courseId,
      privateId,
      ...permissions.map((permission) => permission.courseId),
    ];
    for (const name of ["notes", "coursePermissions", "courseEnrollments"])
      await db
        .collection(name)
        .deleteMany({ $or: [{ courseId: { $in: courseIds } }, { profileId }] });
    await db.collection("courses").deleteMany({ _id: { $in: courseIds } });
    await db.collection("profiles").deleteOne({ _id: profileId });
    for (const name of [
      "sessions",
      "emailVerificationCodes",
      "forgotPasswordTokens",
    ])
      await db
        .collection(name)
        .deleteMany({ $or: [{ userId }, { user_id: userId }] });
    await db.collection("users").deleteOne({ _id: userId });
    await db.collection("tags").deleteMany({
      name: { $in: [`effecttag${suffix}`, `effecttag${suffix}edited`] },
    });
    await client.close();
  }
});
