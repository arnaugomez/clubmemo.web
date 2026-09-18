import * as Effect from "effect/Effect";
import { TestClock } from "effect/testing";
import { describe, expect, it, vi } from "vitest";
import { DocumentTextServiceBrowser } from "@/src/ai-generator/data/services/document-text-service-browser";
import { DocumentTextService } from "@/src/ai-generator/domain/interfaces/document-text-service";
import { DateTimeServiceImpl } from "@/src/common/data/services/date-time-service-impl";

it.each([
  [
    "2026-03-29T12:00:00Z",
    "2026-03-28T23:00:00.000Z",
    "2026-03-29T22:00:00.000Z",
  ],
  [
    "2026-10-25T12:00:00Z",
    "2026-10-24T22:00:00.000Z",
    "2026-10-25T23:00:00.000Z",
  ],
])("Madrid day boundaries follow DST at %s", async (now, today, tomorrow) => {
  const dates = await Effect.runPromise(
    Effect.gen(function* () {
      yield* TestClock.setTime(Date.parse(now));
      const service = new DateTimeServiceImpl();
      return [
        yield* service.getStartOfToday(),
        yield* service.getStartOfTomorrow(),
      ];
    }).pipe(Effect.provide(TestClock.layer())),
  );
  expect(dates.map((date) => date.toISOString())).toEqual([today, tomorrow]);
});

describe("scoped PDF text extraction", () => {
  it.each([
    false,
    true,
  ])("destroys the PDF worker after success or failure (%s)", async (fail) => {
    const destroy = vi.fn(async () => {});
    Object.assign(window, {
      pdfjsLib: {
        GlobalWorkerOptions: {},
        getDocument: () => ({
          destroy,
          promise: Promise.resolve({
            numPages: 2,
            getPage: async (page: number) => ({
              getTextContent: async () => {
                if (fail) throw new Error("Invalid PDF page");
                return { items: [{ str: `Page ${page}` }] };
              },
            }),
          }),
        }),
      },
    });
    const file = {
      type: "application/pdf",
      arrayBuffer: async () => new ArrayBuffer(0),
    } as File;
    const result = await Effect.runPromise(
      Effect.gen(function* () {
        return yield* (yield* DocumentTextService).read(file);
      }).pipe(Effect.provide(DocumentTextServiceBrowser), Effect.result),
    );
    expect(destroy).toHaveBeenCalledOnce();
    expect(result._tag).toBe(fail ? "Failure" : "Success");
    if (result._tag === "Success")
      expect(result.success).toBe("Page 1\nPage 2");
  });
});
