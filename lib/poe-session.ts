import { randomUUID } from "node:crypto";
import type { SignedHeartbeat,VerificationResult } from "./poe-protocol";
export type PoeSession={id:string;contentId:string;listenerId:string;startedAt:number;verifiedSeconds:number;qualified:boolean;last?:SignedHeartbeat;nonces:string[];events:{heartbeat:SignedHeartbeat;result:VerificationResult;serverReceivedAt:number}[]};
const sessions=new Map<string,PoeSession>();
export function startPoeSession(contentId:string,listenerId:string){const s:PoeSession={id:randomUUID(),contentId,listenerId,startedAt:Date.now(),verifiedSeconds:0,qualified:false,nonces:[],events:[]};sessions.set(s.id,s);return s}
export function getPoeSession(id:string){return sessions.get(id)}
export function savePoeSession(s:PoeSession){sessions.set(s.id,s)}
