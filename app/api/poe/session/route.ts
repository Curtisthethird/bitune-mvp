import {NextResponse} from "next/server";import {z} from "zod";import {startPoeSession} from "@/lib/poe-session";
const S=z.object({contentId:z.string().min(1),listenerId:z.string().min(10)});
export async function POST(r:Request){try{const x=S.parse(await r.json());const s=startPoeSession(x.contentId,x.listenerId);return NextResponse.json({sessionId:s.id,thresholdSeconds:60,heartbeatSeconds:5})}catch{return NextResponse.json({error:"Invalid session request"},{status:400})}}
