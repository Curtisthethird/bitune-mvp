import { createHmac, randomUUID } from "node:crypto";

export type PoeInput = {
  sessionId: string;
  trackId: string;
  artistId: string;
  listenedSeconds: number;
};

export function calculateSats(listenedSeconds: number) {
  if (!Number.isInteger(listenedSeconds) || listenedSeconds < 60) return 0;
  return listenedSeconds; // BitTune rule: 1 sat / verified second after qualification.
}

export function createReceipt(input: PoeInput) {
  const verifiedSeconds = Math.min(input.listenedSeconds, 3600);
  const satsCredited = calculateSats(verifiedSeconds);
  const issuedAt = new Date().toISOString();
  const receiptId = randomUUID();
  const payload = [
    receiptId, input.sessionId, input.trackId, input.artistId,
    verifiedSeconds, satsCredited, issuedAt
  ].join("|");
  const secret = process.env.BITUNE_POE_SECRET ?? "development-only-secret";
  const signature = createHmac("sha256", secret).update(payload).digest("hex");
  return {
    receiptId,
    trackId: input.trackId,
    artistId: input.artistId,
    verifiedSeconds,
    satsCredited,
    status: "verified" as const,
    issuedAt,
    signature
  };
}