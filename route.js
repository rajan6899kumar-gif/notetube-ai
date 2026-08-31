import OpenAI from "openai";
import {NextResponse} from "next/server";

function extractId(input){
 try{
  const u=new URL(input);
  if(u.hostname==="youtu.be") return u.pathname.slice(1).split("/")[0];
  if(u.searchParams.get("v")) return u.searchParams.get("v");
  const m=u.pathname.match(/(?:shorts|embed|live)\/([^/?]+)/); return m?m[1]:null;
 }catch{return null}
}

export async function POST(req){
 try{
  const {url,language="English",style="Detailed"}=await req.json();
  const videoId=extractId(url);
  if(!videoId) return NextResponse.json({error:"Invalid YouTube URL."},{status:400});
  if(!process.env.OPENAI_API_KEY) return NextResponse.json({error:"OPENAI_API_KEY is not configured on the server."},{status:500});

  // IMPORTANT: This endpoint expects a transcript provider to be configured.
  // Put the transcript text in TRANSCRIPT_TEXT only for testing, or replace this
  // section with your licensed/authorized transcript service.
  const transcript=process.env.TRANSCRIPT_TEXT;
  if(!transcript) return NextResponse.json({
    error:"Transcript service is not configured yet. Add your authorized YouTube transcript provider in app/api/generate/route.js."
  },{status:501});

  const client=new OpenAI({apiKey:process.env.OPENAI_API_KEY});
  const prompt=`Create ${style} study notes from the transcript below. Write in ${language}. Return ONLY valid JSON matching:
{"title":"string","sections":[{"heading":"string","points":["string"]}]}
Preserve important definitions, formulas, examples and relationships. Do not invent facts. Transcript:
${transcript}`;

  const completion=await client.chat.completions.create({
    model:"gpt-4o-mini",
    temperature:0.2,
    response_format:{type:"json_object"},
    messages:[
      {role:"system",content:"You are an expert academic note-maker. Be accurate and concise."},
      {role:"user",content:prompt}
    ]
  });
  const out=JSON.parse(completion.choices[0].message.content);
  return NextResponse.json({...out,language,style,videoId});
 }catch(e){
  console.error(e); return NextResponse.json({error:e.message||"Unexpected server error."},{status:500});
 }
}