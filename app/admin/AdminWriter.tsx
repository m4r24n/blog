'use client';

import { ChangeEvent, DragEvent, useMemo, useRef, useState } from 'react';
import styles from './AdminWriter.module.css';

type Photo = { file: File; preview: string; safeName: string };
const categories = ['Journal','Projects','Photography','Places','Learning','Work'];

function slugify(value: string) {
  return value.toLowerCase().trim().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'').slice(0,80);
}
function safeFileName(name: string, index: number) {
  const ext = name.split('.').pop()?.toLowerCase().replace(/[^a-z0-9]/g,'') || 'jpg';
  const base = name.replace(/\.[^.]+$/,'').toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'') || `photo-${index+1}`;
  return `${base}.${ext}`;
}
function MarkdownPreview({body}:{body:string}) {
  return <div className={styles.previewBody}>{body.split(/\n\n+/).filter(Boolean).map((block,i)=>{
    if(block.startsWith('### ')) return <h3 key={i}>{block.slice(4)}</h3>;
    if(block.startsWith('## ')) return <h2 key={i}>{block.slice(3)}</h2>;
    if(block.startsWith('> ')) return <blockquote key={i}>{block.slice(2)}</blockquote>;
    if(block.startsWith('- ')) return <ul key={i}>{block.split('\n').map((x,j)=><li key={j}>{x.replace(/^- /,'')}</li>)}</ul>;
    if(block.startsWith('![')) return <p className={styles.imageNote} key={i}>Photo appears here when published.</p>;
    return <p key={i}>{block}</p>;
  })}</div>;
}

export default function AdminWriter() {
  const [title,setTitle]=useState('');
  const [date,setDate]=useState(new Date().toISOString().slice(0,10));
  const [category,setCategory]=useState('Journal');
  const [excerpt,setExcerpt]=useState('');
  const [body,setBody]=useState('');
  const [photos,setPhotos]=useState<Photo[]>([]);
  const [cover,setCover]=useState(0);
  const [tab,setTab]=useState<'write'|'preview'>('write');
  const [status,setStatus]=useState('');
  const [publishing,setPublishing]=useState(false);
  const textarea=useRef<HTMLTextAreaElement>(null);
  const slug=useMemo(()=>slugify(title),[title]);

  function addFiles(files: File[]) {
    const images=files.filter(f=>f.type.startsWith('image/'));
    if(photos.length + images.length > 4) return setStatus('Use at most 4 photos per post.');
    if(images.some(f=>f.size>1_500_000)) return setStatus('Each photo must be 1.5 MB or smaller.');
    if([...photos.map(p=>p.file),...images].reduce((n,f)=>n+f.size,0)>4_000_000) return setStatus('Keep total photo size under 4 MB.');
    const next=images.map((file,i)=>({file,preview:URL.createObjectURL(file),safeName:safeFileName(file.name,photos.length+i)}));
    setPhotos(p=>[...p,...next]); setStatus('');
  }
  function fileInput(e:ChangeEvent<HTMLInputElement>){addFiles(Array.from(e.target.files??[]));}
  function drop(e:DragEvent<HTMLDivElement>){e.preventDefault();addFiles(Array.from(e.dataTransfer.files));}
  function insertPhoto(photo:Photo){
    if(!slug) return setStatus('Add a title first so the photo path has a slug.');
    const markdown=`\n\n![Describe this photo](/images/posts/${slug}/${photo.safeName})\n\n`;
    const el=textarea.current; const start=el?.selectionStart ?? body.length;
    setBody(body.slice(0,start)+markdown+body.slice(start));
  }
  async function publish(){
    if(!title.trim()||!excerpt.trim()||!body.trim()) return setStatus('Title, excerpt and article are required.');
    setPublishing(true); setStatus('Preparing post…');
    try{
      const images=await Promise.all(photos.map(async p=>({name:p.safeName,type:p.file.type,data:await fileToBase64(p.file)})));
      const res=await fetch('/api/admin/publish',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({title,date,category,excerpt,body,cover:photos[cover]?.safeName??null,images})});
      const data=await res.json();
      if(!res.ok) throw new Error(data.error||'Publish failed');
      setStatus(`Published. ${data.url}`);
    }catch(e){setStatus(e instanceof Error?e.message:'Publish failed');}finally{setPublishing(false)}
  }

  return <section className={styles.shell}>
    <header className={styles.top}><div><div className="kicker">Private writer</div><h1>New entry</h1></div><form action="/api/admin/logout" method="post"><button className={styles.ghost}>Sign out</button></form></header>
    <div className={styles.tabs}><button className={tab==='write'?styles.active:''} onClick={()=>setTab('write')}>Write</button><button className={tab==='preview'?styles.active:''} onClick={()=>setTab('preview')}>Preview</button></div>
    {tab==='write'?<div className={styles.editor}>
      <div className={styles.fields}>
        <label>Title<input value={title} onChange={e=>setTitle(e.target.value)} placeholder="Something worth remembering" /></label>
        <div className={styles.row}><label>Date<input type="date" value={date} onChange={e=>setDate(e.target.value)} /></label><label>Category<select value={category} onChange={e=>setCategory(e.target.value)}>{categories.map(x=><option key={x}>{x}</option>)}</select></label></div>
        <label>Excerpt<textarea className={styles.excerpt} value={excerpt} onChange={e=>setExcerpt(e.target.value)} placeholder="One short sentence for the homepage." /></label>
        <label>Article<textarea ref={textarea} className={styles.article} value={body} onChange={e=>setBody(e.target.value)} placeholder={'Write in Markdown…\n\n## A section\n\nYour words here.'} /></label>
      </div>
      <aside><div className={styles.drop} onDragOver={e=>e.preventDefault()} onDrop={drop}><strong>Drop photos here</strong><span>or choose up to 4 images</span><label className={styles.choose}>Choose photos<input hidden type="file" accept="image/*" multiple onChange={fileInput}/></label><small>1.5 MB each · 4 MB total</small></div>
      <div className={styles.photos}>{photos.map((p,i)=><div className={styles.photo} key={p.preview}><img src={p.preview} alt=""/><div><button onClick={()=>setCover(i)}>{cover===i?'Cover ✓':'Make cover'}</button><button onClick={()=>insertPhoto(p)}>Insert</button><button onClick={()=>{setPhotos(x=>x.filter((_,j)=>j!==i));setCover(0)}}>Remove</button></div></div>)}</div></aside>
    </div>:<article className={styles.preview}><div className="kicker">{category} · {date}</div><h1>{title||'Untitled entry'}</h1><p className={styles.deck}>{excerpt||'Your excerpt will appear here.'}</p>{photos[cover]&&<img className={styles.cover} src={photos[cover].preview} alt=""/>}<MarkdownPreview body={body||'Start writing to see the article preview.'}/></article>}
    <footer className={styles.actions}><span>{slug?`/posts/${slug}`:'Add a title to create the URL'}</span><span className={styles.status}>{status}</span><button disabled={publishing} onClick={publish}>{publishing?'Publishing…':'Publish'}</button></footer>
  </section>;
}
function fileToBase64(file:File){return new Promise<string>((resolve,reject)=>{const r=new FileReader();r.onload=()=>resolve(String(r.result).split(',')[1]||'');r.onerror=()=>reject(r.error);r.readAsDataURL(file);});}
