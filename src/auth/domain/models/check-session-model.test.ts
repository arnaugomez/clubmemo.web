import { describe, expect, it } from "vitest";
import type { SessionModelData } from "./check-session-model";
import { SessionModel } from "./check-session-model";

const sessionData: SessionModelData = {
  id: "123",
  expiresAt: new Date(),
  fresh: true,
  userId: "user123",
};
const sessionModel = new SessionModel(sessionData);

describe("SessionModel", () => {
  it("id matches data", () => {
    expect(sessionModel.id).toBe(sessionData.id);
  });

  it("expiresAt matches data", () => {
    expect(sessionModel.expiresAt).toEqual(sessionData.expiresAt);
  });

  it("fresh matches data", () => {
    expect(sessionModel.fresh).toBe(sessionData.fresh);
  });
});
