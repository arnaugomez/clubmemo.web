import { randomUUID } from "node:crypto";
import { expect, test } from "@playwright/test";
import { MongoClient, ObjectId } from "mongodb";
import { testSetting } from "./environment";
import { pdfFixture } from "./pdf-fixture";

// Every record belongs to a unique user created through the public UI.
test("account, course, notes, practice and profile journey", async ({
  page,
}) => {
  test.setTimeout(600_000);
  const suffix = randomUUID().replaceAll("-", "").slice(0, 12);
  const email = `effect-${suffix}@test.com`;
  const password = "test-password-123";
  const client = new MongoClient(testSetting("MONGODB_URL"));
  await client.connect();
  const db = client.db();
  let coursePath = "";
  page.on("pageerror", (error) =>
    console.error("Browser error:", error.message),
  );
  try {
    await test.step("signup and email verification", async () => {
      await page.goto("/auth/signup");
      await page.getByTestId("email").fill(email);
      await page.getByTestId("password").fill(password);
      await page.getByTestId("acceptTerms").click();
      await page.getByTestId("submit").click();
      await expect(page.getByTestId("verify-email-title")).toBeVisible();
      const user = await db.collection("users").findOne({ email });
      if (!user) throw new Error("Signup did not persist a user");
      const code = await db
        .collection("emailVerificationCodes")
        .findOne({ userId: user._id });
      if (!code) throw new Error("Signup did not create a verification code");
      await page.getByLabel("Código de verificación").fill(code.code);
      await expect(page).toHaveURL(/\/home$/, { timeout: 30_000 });
      await expect(page.locator("main")).not.toContainText("Algo ha ido mal");
    });
    await test.step("create a course and card", async () => {
      await page.goto("/courses");
      await page
        .getByRole("button", { name: /Crear curso|Nuevo curso/ })
        .first()
        .click();
      await page.getByLabel("Nombre del curso").fill(`Effect ${suffix}`);
      await page
        .getByRole("button", { name: "Crear curso", exact: true })
        .click();
      await expect(page).toHaveURL(/\/courses\/detail\/[a-f0-9]+$/);
      await expect(
        page.getByRole("heading", { name: `Effect ${suffix}`, exact: true }),
      ).toBeVisible();
      await page
        .getByRole("button", { name: "Empezar", exact: true })
        .first()
        .click();
      await page
        .locator('[contenteditable="true"]')
        .nth(0)
        .fill("Effect question");
      await page
        .locator('[contenteditable="true"]')
        .nth(1)
        .fill("Effect answer");
      await page.getByRole("button", { name: "Enviar", exact: true }).click();
      await expect(page.getByRole("dialog")).toHaveCount(0);
      await expect(
        page.getByRole("heading", { name: "Effect question", exact: true }),
      ).toBeVisible();
      await page.reload();
      await page.getByRole("link", { name: "Practicar", exact: true }).click();
      await expect(page).toHaveURL(/\/practice$/);
      coursePath = new URL(page.url()).pathname.replace(/\/practice$/, "");
      await page
        .getByRole("button", { name: "Mostrar respuesta", exact: true })
        .click();
      await expect(
        page.getByText("Effect answer", { exact: true }),
      ).toBeVisible();
      await page.getByRole("button", { name: "Bien", exact: true }).click();
      for (let repeat = 0; repeat < 5; repeat++) {
        const finished = page.getByText(
          /Práctica completada|No hay tarjetas pendientes de practicar/,
        );
        const next = page.getByRole("button", {
          name: "Mostrar respuesta",
          exact: true,
        });
        await expect(finished.or(next)).toBeVisible();
        if (await finished.isVisible()) break;
        await next.click();
        await page.getByRole("button", { name: "Bien", exact: true }).click();
      }
      await expect(
        page.getByText(
          /Práctica completada|No hay tarjetas pendientes de practicar/,
        ),
      ).toBeVisible();
      await page.getByRole("link", { name: "Volver al curso" }).click();
      await expect(page).toHaveURL(new RegExp(`${coursePath}$`));
      const enrollment = await db
        .collection("courseEnrollments")
        .findOne({ courseId: new ObjectId(coursePath.split("/").pop()) });
      if (!enrollment) throw new Error("Course enrollment was not persisted");
      await expect
        .poll(() =>
          db
            .collection("reviewLogs")
            .countDocuments({ courseEnrollmentId: enrollment._id }),
        )
        .toBeGreaterThan(0);
    });
    await test.step("edit card, favorite and configure learning", async () => {
      const card = page
        .locator("div.rounded-xl, div.rounded-lg")
        .filter({
          has: page.getByRole("heading", {
            name: "Effect question",
            exact: true,
          }),
        })
        .last();
      await card.locator("button").first().click();
      await page
        .locator('[contenteditable="true"]')
        .nth(0)
        .fill("Edited Effect question");
      await page.getByRole("button", { name: "Enviar", exact: true }).click();
      await expect(page.getByRole("dialog")).toHaveCount(0);
      await expect(
        page.getByRole("heading", {
          name: "Edited Effect question",
          exact: true,
        }),
      ).toBeVisible();
      await page.getByRole("button", { name: "Opciones del curso" }).click();
      await page
        .getByRole("menuitem", { name: "Destacar", exact: true })
        .click();
      if (
        !(await page
          .getByRole("menuitem", { name: "Destacado", exact: true })
          .isVisible())
      ) {
        await page.getByRole("button", { name: "Opciones del curso" }).click();
      }
      await expect(
        page.getByRole("menuitem", { name: "Destacado", exact: true }),
      ).toBeVisible();
      await page
        .getByRole("menuitem", { name: "Ajustes", exact: true })
        .click();
      await page
        .getByLabel("Mostrar opciones de calificación avanzadas")
        .click();
      await page.getByRole("button", { name: "Enviar", exact: true }).click();
      await expect(page.getByRole("dialog")).toHaveCount(0);
    });
    await test.step("import all supported formats and export persisted notes", async () => {
      const inputs = [
        {
          tab: "CSV",
          name: "notes.csv",
          mimeType: "text/csv",
          text: "CSV question,CSV answer\n",
        },
        {
          tab: "JSON",
          name: "notes.json",
          mimeType: "application/json",
          text: JSON.stringify({ notes: [["JSON question", "JSON answer"]] }),
        },
        {
          tab: "Anki",
          name: "notes.txt",
          mimeType: "text/plain",
          text: '"Anki question"\t"Anki answer"\t\n',
        },
      ];
      for (const input of inputs) {
        await page
          .getByRole("button", { name: "Otras opciones de añadir tarjeta" })
          .click();
        await page.getByRole("menuitem", { name: "Importar archivo" }).click();
        await page.getByRole("tab", { name: input.tab, exact: true }).click();
        await page.locator('input[type="file"]').setInputFiles({
          name: input.name,
          mimeType: input.mimeType,
          buffer: Buffer.from(input.text),
        });
        await page.getByRole("button", { name: "Enviar", exact: true }).click();
        await expect(page.getByRole("dialog")).toHaveCount(0);
        await expect(
          page.getByRole("heading", {
            name: `${input.tab} question`,
            exact: true,
          }),
        ).toBeVisible();
      }
      for (const format of ["json", "csv", "anki"]) {
        const response = await page.evaluate(async (url) => {
          const result = await fetch(url);
          return { status: result.status, body: await result.text() };
        }, `${coursePath}/export/${format}`);
        expect(response.status, response.body).toBe(200);
        const body = response.body;
        expect(body).toContain("Edited Effect question");
        expect(body).toContain("JSON question");
      }
    });
    await test.step("generate, preview and persist AI notes", async () => {
      await page.goto(`${coursePath}/ai-generator`);
      await page
        .getByRole("button", { name: "Empezar", exact: true })
        .nth(1)
        .click();
      await page
        .getByLabel("Texto", { exact: true })
        .fill(
          "Las ecuaciones de segundo grado tienen un exponente máximo de dos.",
        );
      await page.getByRole("button", { name: "Enviar", exact: true }).click();
      await expect(
        page.getByText("Tarjetas generadas", { exact: true }),
      ).toBeVisible();
      await page
        .getByRole("button", { name: "Añadir tarjetas al curso" })
        .click();
      await expect(page).toHaveURL(new RegExp(`${coursePath}$`));
      await expect(
        page.getByRole("heading", {
          name: "¿Cómo se define una ecuación de segundo grado?",
          exact: true,
        }),
      ).toBeVisible();
    });
    await test.step("topic, text file and PDF generation support preview cancellation", async () => {
      const courseId = new ObjectId(coursePath.split("/").pop());
      const persisted = await db
        .collection("notes")
        .countDocuments({ courseId });
      for (const source of ["topic", "text", "pdf"]) {
        await page.goto(`${coursePath}/ai-generator`);
        await page
          .getByRole("button", { name: "Empezar", exact: true })
          .nth(source === "topic" ? 2 : 0)
          .click();
        if (source === "topic") {
          await page
            .getByLabel("Tema", { exact: true })
            .fill("Ecuaciones de segundo grado");
        } else {
          await page.locator('input[type="file"]').setInputFiles({
            name: source === "pdf" ? "notes.pdf" : "notes.txt",
            mimeType: source === "pdf" ? "application/pdf" : "text/plain",
            buffer:
              source === "pdf"
                ? pdfFixture("Water boils at 100 degrees Celsius.")
                : Buffer.from("El agua hierve a 100 grados Celsius."),
          });
        }
        await page.getByRole("button", { name: "Enviar", exact: true }).click();
        await expect(
          page.getByText("Tarjetas generadas", { exact: true }),
        ).toBeVisible();
        const first = page.getByRole("heading", {
          name: "¿Cómo se define una ecuación de segundo grado?",
          exact: true,
        });
        await first.locator("..").getByRole("button").click();
        await expect(first).toHaveCount(0);
        await page.getByRole("button", { name: "Volver", exact: true }).click();
        await expect(
          page.getByRole("button", { name: "Enviar", exact: true }),
        ).toBeVisible();
        expect(await db.collection("notes").countDocuments({ courseId })).toBe(
          persisted,
        );
      }
      await page.goto(coursePath);
    });
    await test.step("edit course privacy and delete a card", async () => {
      await page.getByRole("button", { name: "Editar", exact: true }).click();
      await page.getByLabel("Nombre del curso").fill(`Edited ${suffix}`);
      await page
        .getByLabel("Descripción", { exact: true })
        .fill("A course edited through the browser");
      await page.getByLabel("Curso público", { exact: true }).click();
      await page.getByRole("button", { name: "Enviar", exact: true }).click();
      await expect(page.getByRole("dialog")).toHaveCount(0);
      await expect(
        page.getByRole("heading", { name: `Edited ${suffix}`, exact: true }),
      ).toBeVisible();
      const course = await db
        .collection("courses")
        .findOne({ _id: new ObjectId(coursePath.split("/").pop()) });
      expect(course?.isPublic).toBe(true);
      const card = page
        .locator("div.rounded-xl, div.rounded-lg")
        .filter({
          has: page.getByRole("heading", {
            name: "¿Cómo se define una ecuación de segundo grado?",
            exact: true,
          }),
        })
        .last();
      await card.getByRole("button").nth(1).click();
      await page.getByRole("button", { name: "Eliminar", exact: true }).click();
      await expect(page.getByRole("dialog")).toHaveCount(0);
      await expect(
        page.getByRole("heading", {
          name: "¿Cómo se define una ecuación de segundo grado?",
          exact: true,
        }),
      ).toHaveCount(0);
    });
    await test.step("edit profile and upload an image", async () => {
      await page.goto("/profile");
      await page.getByRole("button", { name: "Editar", exact: true }).click();
      await page
        .getByLabel("Nombre de usuario", { exact: true })
        .fill(`Effect ${suffix}`);
      await page
        .getByLabel("Identificador", { exact: true })
        .fill(`effect${suffix}`);
      await page
        .getByLabel("Bio", { exact: true })
        .fill("Effect migration browser test");
      await page
        .locator('input[type="file"]')
        .first()
        .setInputFiles("app/icon1.png");
      await page.getByRole("button", { name: "Enviar", exact: true }).click();
      await expect(page.getByRole("dialog")).toHaveCount(0);
      await expect(
        page.getByText("Effect migration browser test", { exact: true }),
      ).toBeVisible();
    });
    await test.step("change password, logout and login", async () => {
      await page.goto("/settings");
      await page
        .getByRole("button", { name: "Cambiar contraseña", exact: true })
        .click();
      await page
        .getByLabel("Tu contraseña actual", { exact: true })
        .fill(password);
      await page
        .getByLabel("Nueva contraseña", { exact: true })
        .fill("changed-password-123");
      await page
        .getByLabel("Repetir contraseña", { exact: true })
        .fill("changed-password-123");
      await page.getByRole("button", { name: "Enviar", exact: true }).click();
      await expect(page.getByRole("dialog")).toHaveCount(0);
      await page.getByRole("button", { name: "Cerrar sesión y salir" }).click();
      await expect(page).not.toHaveURL(/\/settings$/);
      await page.goto("/auth/login");
      await page.getByTestId("email").fill(email);
      await page.getByTestId("password").fill("changed-password-123");
      await page.getByTestId("submit").click();
      await expect(page).toHaveURL(/\/home$/);
    });
  } catch (error) {
    console.error(
      "FAILURE PAGE",
      page.url(),
      await page.locator("body").innerText(),
    );
    await page.screenshot({
      path: "test-results/journey-failure.png",
      fullPage: true,
    });
    throw error;
  } finally {
    if (test.info().status !== test.info().expectedStatus) {
      console.error(
        "FAILURE PAGE",
        page.url(),
        await page.locator("body").innerText(),
      );
      await page.screenshot({
        path: "test-results/journey-failure.png",
        fullPage: true,
      });
    }
    const user = await db.collection("users").findOne({ email });
    if (user) {
      const profiles = await db
        .collection("profiles")
        .find({ userId: user._id })
        .toArray();
      const profileIds = profiles.map((profile) => profile._id);
      const permissions = await db
        .collection("coursePermissions")
        .find({ profileId: { $in: profileIds } })
        .toArray();
      const courseIds = permissions.map((permission) => permission.courseId);
      const enrollments = await db
        .collection("courseEnrollments")
        .find({ profileId: { $in: profileIds } })
        .toArray();
      const enrollmentIds = enrollments.map((enrollment) => enrollment._id);
      for (const name of ["practiceCards", "reviewLogs"])
        await db
          .collection(name)
          .deleteMany({ courseEnrollmentId: { $in: enrollmentIds } });
      const uploads = await db
        .collection("fileUploads")
        .find({ createdByUserId: user._id })
        .toArray();
      if (uploads.length) {
        const { S3Client, DeleteObjectCommand } = await import(
          "@aws-sdk/client-s3"
        );
        const s3 = new S3Client({ region: process.env.AWS_REGION });
        try {
          for (const upload of uploads)
            await s3.send(
              new DeleteObjectCommand({
                Bucket: process.env.AWS_BUCKET_NAME,
                Key: upload.key,
              }),
            );
        } finally {
          s3.destroy();
        }
        await db
          .collection("fileUploads")
          .deleteMany({ createdByUserId: user._id });
      }
      for (const name of [
        "notes",
        "coursePermissions",
        "courseEnrollments",
        "practiceCards",
        "reviewLogs",
      ]) {
        await db.collection(name).deleteMany({
          $or: [
            { courseId: { $in: courseIds } },
            { profileId: { $in: profileIds } },
          ],
        });
      }
      await db.collection("courses").deleteMany({ _id: { $in: courseIds } });
      await db.collection("profiles").deleteMany({ userId: user._id });
      for (const name of [
        "sessions",
        "emailVerificationCodes",
        "forgotPasswordTokens",
      ])
        await db
          .collection(name)
          .deleteMany({ $or: [{ userId: user._id }, { user_id: user._id }] });
      await db.collection("users").deleteOne({ _id: user._id });
    }
    await client.close();
  }
});
