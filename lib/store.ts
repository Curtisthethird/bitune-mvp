import { promises as fs } from "node:fs";
import path from "node:path";
import { randomUUID, scryptSync, timingSafeEqual, createHmac } from "node:crypto";

export type Artist={id:string,email:string,passwordHash:string,name:string,bio:string,createdAt:string};
export type Track={id:string,artistId:string,title:string,genre:string,audioUrl:string,artworkUrl:string,createdAt:string,verifiedPlays:number,sats:number};
type DB={artists:Artist[],tracks:Track[],sessions:{id:string,artistId:string,expiresAt:number}[],claims:string[]};
const file=path.join(process.cwd(),'data','bitune.json');
const empty:DB={artists:[],tracks:[],sessions:[],claims:[]};
async function read():Promise<DB>{try{return JSON.parse(await fs.readFile(file,'utf8'))}catch{return structuredClone(empty)}}
async function write(db:DB){await fs.mkdir(path.dirname(file),{recursive:true});await fs.writeFile(file,JSON.stringify(db,null,2))}
export function hashPassword(password:string){const salt=randomUUID();return salt+':'+scryptSync(password,salt,64).toString('hex')}
export function verifyPassword(password:string,stored:string){const [salt,hex]=stored.split(':');if(!salt||!hex)return false;const a=scryptSync(password,salt,64),b=Buffer.from(hex,'hex');return a.length===b.length&&timingSafeEqual(a,b)}
export async function createArtist(email:string,password:string,name:string){const db=await read();if(db.artists.some(a=>a.email===email.toLowerCase()))throw new Error('EMAIL_EXISTS');const a:Artist={id:randomUUID(),email:email.toLowerCase(),passwordHash:hashPassword(password),name,bio:'',createdAt:new Date().toISOString()};db.artists.push(a);await write(db);return a}
export async function authenticate(email:string,password:string){const db=await read();const a=db.artists.find(x=>x.email===email.toLowerCase());return a&&verifyPassword(password,a.passwordHash)?a:null}
export async function createSession(artistId:string){const db=await read();const s={id:randomUUID(),artistId,expiresAt:Date.now()+7*864e5};db.sessions=db.sessions.filter(x=>x.expiresAt>Date.now());db.sessions.push(s);await write(db);return s}
export async function artistForSession(id?:string){if(!id)return null;const db=await read();const s=db.sessions.find(x=>x.id===id&&x.expiresAt>Date.now());return s?db.artists.find(a=>a.id===s.artistId)??null:null}
export async function deleteSession(id?:string){if(!id)return;const db=await read();db.sessions=db.sessions.filter(x=>x.id!==id);await write(db)}
export async function addTrack(t:Omit<Track,'id'|'createdAt'|'verifiedPlays'|'sats'>){const db=await read();const track:Track={...t,id:randomUUID(),createdAt:new Date().toISOString(),verifiedPlays:0,sats:0};db.tracks.push(track);await write(db);return track}
export async function tracksForArtist(artistId:string){return (await read()).tracks.filter(t=>t.artistId===artistId)}
export async function allTracks(){return (await read()).tracks}
export async function getTrack(id:string){return (await read()).tracks.find(t=>t.id===id)??null}
export async function claimEngagement(sessionId:string,trackId:string,seconds:number){const db=await read();if(db.claims.includes(sessionId))throw new Error('CLAIMED');const t=db.tracks.find(x=>x.id===trackId);if(!t)throw new Error('TRACK');const sats=seconds; t.verifiedPlays++;t.sats+=sats;db.claims.push(sessionId);await write(db);return {track:t,sats}}
export function signReceipt(payload:string){return createHmac('sha256',process.env.BITUNE_POE_SECRET??'development-only-secret').update(payload).digest('hex')}
