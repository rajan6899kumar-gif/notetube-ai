 "use client";
import {useState} from "react";
import {Sparkles, Youtube, Download, FileText, CheckCircle2} from "lucide-react";

export default function Home(){
 const [url,setUrl]=useState(""); const [language,setLanguage]=useState("English");
 const [style,setStyle]=useState("Detailed"); const [loading,setLoading]=useState(false);
 const [notes,setNotes]=useState(null); const [error,setError]=useState("");

 async function generate(e){
  e.preventDefault(); setError(""); setNotes(null);
  if(!url.includes("youtube.com")&&!url.includes("youtu.be")) return setError("Please enter a valid YouTube URL.");
  setLoading(true);
  try{
   const r=await fetch("/api/generate",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({url,language,style})});
   const d=await r.json(); if(!r.ok) throw new Error(d.error||"Generation failed.");
   setNotes(d);
  }catch(err){setError(err.message)} finally{setLoading(false)}
 }
 function pdf(){window.print()}
 return <main>
  <nav className="nav"><div className="brand"><span className="logo"><Sparkles size={16}/></span> NoteTube <small>AI</small></div><span className="navMuted">YouTube → Notes → PDF</span></nav>
  <section className="hero">
   <div className="pill"><Sparkles size={14}/> AI-powered study notes</div>
   <h1>Turn YouTube videos<br/><span>into study notes.</span></h1>
   <p>Paste a lecture, tutorial or educational video. NoteTube extracts the transcript and turns it into structured, revision-ready notes.</p>
   <form className="box" onSubmit={generate}>
    <div className="inputRow"><Youtube className="red" size={21}/><input value={url} onChange={e=>setUrl(e.target.value)} placeholder="Paste YouTube URL..."/><button disabled={loading}>{loading?"Generating…":<>Generate <Sparkles size={16}/></>}</button></div>
    <div className="opts">
     <label>Language <select value={language} onChange={e=>setLanguage(e.target.value)}><option>English</option><option>Hindi</option><option>Hinglish</option></select></label>
     <label>Style <select value={style} onChange={e=>setStyle(e.target.value)}><option>Detailed</option><option>Quick Revision</option><option>Exam Notes</option></select></label>
     <span><CheckCircle2 size={14}/> API keys stay server-side</span>
    </div>
    {error&&<div className="error">{error}</div>}
   </form>
  </section>
  {notes&&<section className="results">
   <div className="resultHead"><div><small>GENERATED NOTES</small><h2>{notes.title}</h2><p>{notes.language} • {notes.style}</p></div><button className="pdf" onClick={pdf}><Download size={16}/> Export PDF</button></div>
   <div className="paper"><div className="warning">AI-generated notes. Verify important facts, formulas and dates against the original video.</div>
    {notes.sections.map((s,i)=><article key={i}><h3>{i+1}. {s.heading}</h3><ul>{s.points.map((p,j)=><li key={j}>{p}</li>)}</ul></article>)}
   </div>
  </section>}
  <footer>NoteTube AI <span>Built for learning</span></footer>
 </main>
}