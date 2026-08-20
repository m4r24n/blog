import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { ADMIN_COOKIE, isAdminSession } from '../../../../lib/admin-auth';

export const runtime = 'nodejs';
export const maxDuration = 30;
const REPO = 'm4r24n/blog';
const categories = new Set(['Journal','Projects','Photography','Places','Learning','Work']);

type ImageInput = { name:string; type:string; data:string };
function slugify(value:string){return value.toLowerCase().trim().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'').slice(0,80)}
function yaml(value:string){return JSON.stringify(value)}
async function gh(path:string, init:RequestInit={}){
  const token=process.env.GITHUB_PUBLISH_TOKEN;
  if(!token) throw new Error('GITHUB_PUBLISH_TOKEN is not configured.');
  const res=await fetch(`https://api.github.com/repos/${REPO}${path}`,{...init,headers:{Accept:'application/vnd.github+json',Authorization:`Bearer ${token}`,'X-GitHub-Api-Version':'2022-11-28','Content-Type':'application/json',...(init.headers||{})},cache:'no-store'});
  if(!res.ok) throw new Error(`GitHub ${res.status}: ${await res.text()}`);
  return res.json();
}

export async function POST(request:Request){
  const store=await cookies();
  if(!isAdminSession(store.get(ADMIN_COOKIE)?.value)) return NextResponse.json({error:'Unauthorized'},{status:401});
  try{
    const input=await request.json();
    const title=String(input.title??'').trim(), excerpt=String(input.excerpt??'').trim(), body=String(input.body??'').trim();
    const date=String(input.date??''), category=String(input.category??''), cover=input.cover?String(input.cover):null;
    const images=(Array.isArray(input.images)?input.images:[]) as ImageInput[];
    const slug=slugify(title);
    if(!slug||!title||!excerpt||!body||!/^\d{4}-\d{2}-\d{2}$/.test(date)||!categories.has(category)) return NextResponse.json({error:'Invalid post fields.'},{status:400});
    if(images.length>4||images.some(x=>!x.data||x.data.length>2_100_000)) return NextResponse.json({error:'Photo limits exceeded.'},{status:413});

    const head=await gh('/git/ref/heads/main');
    const headSha=head.object.sha as string;
    const commit=await gh(`/git/commits/${headSha}`);
    const exists=await fetch(`https://api.github.com/repos/${REPO}/contents/content/posts/${slug}.mdx?ref=main`,{headers:{Authorization:`Bearer ${process.env.GITHUB_PUBLISH_TOKEN}`,Accept:'application/vnd.github+json'},cache:'no-store'});
    if(exists.ok) return NextResponse.json({error:'A post with this URL already exists.'},{status:409});

    const imageEntries=[] as {path:string;mode:string;type:string;sha:string}[];
    for(const image of images){
      const clean=image.name.toLowerCase().replace(/[^a-z0-9._-]/g,'-');
      const blob=await gh('/git/blobs',{method:'POST',body:JSON.stringify({content:image.data,encoding:'base64'})});
      imageEntries.push({path:`public/images/posts/${slug}/${clean}`,mode:'100644',type:'blob',sha:blob.sha});
    }
    const coverPath=cover?`/images/posts/${slug}/${cover.toLowerCase().replace(/[^a-z0-9._-]/g,'-')}`:'';
    const frontmatter=['---',`title: ${yaml(title)}`,`date: ${yaml(date)}`,`category: ${yaml(category)}`,`excerpt: ${yaml(excerpt)}`];
    if(coverPath){frontmatter.push(`image: ${yaml(coverPath)}`,`imageAlt: ${yaml(title)}`)}
    frontmatter.push('---','','');
    const mdx=frontmatter.join('\n')+body+'\n';
    const postBlob=await gh('/git/blobs',{method:'POST',body:JSON.stringify({content:mdx,encoding:'utf-8'})});
    const tree=await gh('/git/trees',{method:'POST',body:JSON.stringify({base_tree:commit.tree.sha,tree:[...imageEntries,{path:`content/posts/${slug}.mdx`,mode:'100644',type:'blob',sha:postBlob.sha}]})});
    const newCommit=await gh('/git/commits',{method:'POST',body:JSON.stringify({message:`Publish: ${title}`,tree:tree.sha,parents:[headSha]})});
    await gh('/git/refs/heads/main',{method:'PATCH',body:JSON.stringify({sha:newCommit.sha,force:false})});
    return NextResponse.json({ok:true,commit:newCommit.sha,url:`https://blog.marzan.info/posts/${slug}`});
  }catch(error){console.error(error);return NextResponse.json({error:error instanceof Error?error.message:'Publish failed.'},{status:500})}
}
