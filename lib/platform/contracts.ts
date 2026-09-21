export type PlaybackHeartbeat={sessionId:string;trackId:string;position:number;playing:boolean;visible:boolean;at:number};
export type FraudDecision={allow:boolean;score:number;reasons:string[]};
export interface ObjectStorage{put(key:string,bytes:Uint8Array,contentType:string):Promise<string>;remove(key:string):Promise<void>}
export interface Mailer{send(to:string,subject:string,body:string):Promise<void>}
export interface LightningSettlement{credit(artistId:string,sats:number,receiptId:string):Promise<{settlementId:string,status:"simulated"|"pending"|"paid"}>}
export interface ChainAnchor{anchor(root:string,count:number):Promise<{anchorId:string,status:"simulated"|"submitted"|"confirmed"}>}
export interface SocialPublisher{publish(kind:string,payload:Record<string,unknown>):Promise<{eventId:string,status:"simulated"|"published"}>}
