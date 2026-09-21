import { createPublicKey, verify as nodeVerify, createHash } from "node:crypto";

export type SignedHeartbeat = {
  version: 1;
  contentId: string;
  sessionId: string;
  publicKeyJwk: JsonWebKey;
  sequence: number;
  playbackPosition: number;
  playbackRate: number;
  volume: number;
  visible: boolean;
  playing: boolean;
  clientTimestamp: number;
  nonce: string;
  signature: string;
};

export type VerificationResult = {
  valid: boolean;
  creditedSeconds: number;
  reasons: string[];
  checks: Record<string, boolean>;
};

export function canonicalHeartbeat(h: Omit<SignedHeartbeat,"signature">) {
  return JSON.stringify({
    version:h.version, contentId:h.contentId, sessionId:h.sessionId,
    publicKeyJwk:h.publicKeyJwk, sequence:h.sequence,
    playbackPosition:Number(h.playbackPosition.toFixed(3)),
    playbackRate:Number(h.playbackRate.toFixed(3)),
    volume:Number(h.volume.toFixed(3)), visible:h.visible, playing:h.playing,
    clientTimestamp:h.clientTimestamp, nonce:h.nonce
  });
}

export function listenerIdFromKey(jwk: JsonWebKey) {
  return "did:bitune:" + createHash("sha256")
    .update(JSON.stringify(jwk)).digest("hex").slice(0,40);
}

export function verifyHeartbeatSignature(h: SignedHeartbeat) {
  try {
    const {signature,...unsigned}=h;
    const key=createPublicKey({key:h.publicKeyJwk,format:"jwk"});
    return nodeVerify("sha256",Buffer.from(canonicalHeartbeat(unsigned)),key,Buffer.from(signature,"base64"));
  } catch { return false; }
}

export function verifyHeartbeat(
  h: SignedHeartbeat,
  previous: SignedHeartbeat | undefined,
  serverNow: number,
  nonceAlreadyUsed: boolean
): VerificationResult {
  const checks:Record<string,boolean> = {
    signature: verifyHeartbeatSignature(h),
    uniqueNonce: !nonceAlreadyUsed,
    playing: h.playing,
    visible: h.visible,
    volume: h.volume >= 0.05 && h.volume <= 1,
    playbackRate: h.playbackRate >= 0.75 && h.playbackRate <= 1.25,
    timestamp: Math.abs(serverNow-h.clientTimestamp) <= 30_000,
    sequence: !previous || h.sequence === previous.sequence+1,
    monotonic: !previous || h.playbackPosition > previous.playbackPosition,
    timing: true
  };
  let creditedSeconds=0;
  if(previous){
    const wall=(h.clientTimestamp-previous.clientTimestamp)/1000;
    const media=h.playbackPosition-previous.playbackPosition;
    checks.timing=wall>0 && wall<=15 && media>0 && Math.abs(media-wall*h.playbackRate)<=2.5;
    creditedSeconds=Math.max(0,Math.min(5,wall,media/h.playbackRate));
  }
  const valid=Object.values(checks).every(Boolean);
  return {valid,creditedSeconds:valid?creditedSeconds:0,
    reasons:Object.entries(checks).filter(([,v])=>!v).map(([k])=>k),checks};
}
