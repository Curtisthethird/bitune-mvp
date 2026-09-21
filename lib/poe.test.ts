import { describe, expect, it } from "vitest";
import { calculateSats, createReceipt } from "./poe";

describe("BitTune PoE", () => {
  it("does not pay before 60 seconds", () => expect(calculateSats(59)).toBe(0));
  it("credits one sat per verified second after threshold", () => expect(calculateSats(60)).toBe(60));
  it("rejects fractional seconds", () => expect(calculateSats(60.5)).toBe(0));
  it("creates signed receipts", () => {
    const r = createReceipt({sessionId:crypto.randomUUID(),trackId:"track_1",artistId:"artist_1",listenedSeconds:60});
    expect(r.satsCredited).toBe(60);
    expect(r.signature).toMatch(/^[a-f0-9]{64}$/);
  });
});