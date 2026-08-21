import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import matter from 'gray-matter';
import { ADMIN_COOKIE, isAdminSession } from '../../../../lib/admin-auth';

export const runtime = 'nodejs';
export const maxDuration = 30;
const REPO = 'm4r24n/blog';
const categories = new Set(['Journal','Projects','Photography','Places','Learning','Work']);

type ImageInput = { name:string; type:string; data:string };
type GitHubContentFile = { name:string; path:string; type:string; content?:string };
type TreeItem = { path:string; type:string };

function validSlug(value:string){return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value)}
function yaml(value:string){return JSON.stringify(value)}
function readingTime(text:string){const words=text.trim().split(/\s+/).filter(Boolean).length;return `${Math.max(1,Math.ceil(words/220))} min read`}

function authToken(){const token=process.env.GITHUB_PUBLISH_TOKEN;if(!token) throw new Error('GITHUB_PUBLISH_TOKEN is not configured.');return token}
async function ghResponse(path:string,init:RequestInit={}){
  return fetch(`https://api.github.com/repos/${REPO}${path}`,{...init,headers:{Accept:'application/vnd.github+json',Authorization:`Bearer ${authToken()}`,'X-GitHub-Api-Version':'2022-11-28','Content-Type':'application/json',...(init.headers||{})},cache:'no-store'});
}
async function gh(path:string,init:RequestInit={}){const res=await ghResponse(path,init);if(!res.ok) throw new Error(`GitHub ${res.status}: ${await res.text()}`);return res.json() as Promise<any>}
function decodeFile(file:GitHubContentFile){if(!file.content) throw new Error('Post content is missing.');return Buffer.from(file.content.replace(/\n/g,''),'base64').toString('utf8')}
async function readPost(slug:string){
  const file=await gh(`/contents/content/posts/${slug}.mdx?ref=main`) as GitHubContentFile;
  const source=decodeFile(file);const parsed=matter(source);
  return {slug,title:String(parsed.data.title??''),date:String(parsed.data.date??''),category:String(parsed.data.category??'Journal'),excerpt:String(parsed.data.excerpt??''),image:parsed.data.image?String(parsed.data.image):null,readingTime:readingTime(parsed.content),body:parsed.content.trim()};
}
async function listImages(slug:string){
  const res=await ghResponse(`/contents/public/images/posts/${slug}?ref=main`);
  if(res.status===404) return [] as string[];
  if(!res.ok) throw new Error(`GitHub ${res.status}: ${await res.text()}`);
  const items=await res.json() as GitHubContentFile[];
  return items.filter(x=>x.type==='file').map(x=>`/images/posts/${slug}/${x.name}`);
}
async function requireAdmin(){const store=await cookies();return isAdminSession(store.get(ADMIN_COOKIE)?.value)}

export async function GET(request:Request){
  if(!await requireAdmin()) return NextResponse.json({error:'Unauthorized'},{status:401});
  try{
    const slug=new URL(request.url).searchParams.get('slug');
    if(slug){if(!validSlug(slug)) return NextResponse.json({error:'Invalid slug.'},{status:400});const post=await readPost(slug);const images=await listImages(slug);return NextResponse.json({...post,images});}
    const files=await gh('/contents/content/posts?ref=main') as GitHubContentFile[];
    const posts=await Promise.all(files.filter(x=>x.type==='file'&&x.name.endsWith('.mdx')).map(x=>readPost(x.name.replace(/\.mdx$/,''))));
    posts.sort((a,b)=>new Date(b.date).getTime()-new Date(a.date).getTime());
    return NextResponse.json({posts:posts.map(({body,...post})=>post)});
  }catch(error){console.error(error);return NextResponse.json({error:error instanceof Error?error.message:'Could not load posts.'},{status:500})}
}

export async function PUT(request:Request){
  if(!await requireAdmin()) return NextResponse.json({error:'Unauthorized'},{status:401});
  try{
    const input=await request.json();
    const originalSlug=String(input.originalSlug??'');const title=String(input.title??'').trim(),excerpt=String(input.excerpt??'').trim(),body=String(input.body??'').trim();
    const date=String(input.date??''),category=String(input.category??''),cover=input.cover?String(input.cover):null;
    const images=(Array.isArray(input.images)?input.images:[]) as ImageInput[];
    if(!validSlug(originalSlug)||!title||!excerpt||!body||!/^\d{4}-\d{2}-\d{2}$/.test(date)||!categories.has(category)) return NextResponse.json({error:'Invalid post fields.'},{status:400});
    if(images.length>4||images.some(x=>!x.data||x.data.length>2_100_000)) return NextResponse.json({error:'Photo limits exceeded.'},{status:413});
    const head=await gh('/git/ref/heads/main');const headSha=head.object.sha as string;const commit=await gh(`/git/commits/${headSha}`);
    const imageEntries=[] as {path:string;mode:string;type:string;sha:string}[];
    for(const image of images){const clean=image.name.toLowerCase().replace(/[^a-z0-9._-]/g,'-');const blob=await gh('/git/blobs',{method:'POST',body:JSON.stringify({content:image.data,encoding:'base64'})});imageEntries.push({path:`public/images/posts/${originalSlug}/${clean}`,mode:'100644',type:'blob',sha:blob.sha});}
    let coverPath='';if(cover){coverPath=cover.startsWith('/')?cover:`/images/posts/${originalSlug}/${cover.toLowerCase().replace(/[^a-z0-9._-]/g,'-')}`;}
    const frontmatter=['---',`title: ${yaml(title)}`,`date: ${yaml(date)}`,`category: ${yaml(category)}`,`excerpt: ${yaml(excerpt)}`];if(coverPath) frontmatter.push(`image: ${yaml(coverPath)}`,`imageAlt: ${yaml(title)}`);frontmatter.push('---','','');
    const mdx=frontmatter.join('\n')+body+'\n';const postBlob=await gh('/git/blobs',{method:'POST',body:JSON.stringify({content:mdx,encoding:'utf-8'})});
    const tree=await gh('/git/trees',{method:'POST',body:JSON.stringify({base_tree:commit.tree.sha,tree:[...imageEntries,{path:`content/posts/${originalSlug}.mdx`,mode:'100644',type:'blob',sha:postBlob.sha}]})});
    const newCommit=await gh('/git/commits',{method:'POST',body:JSON.stringify({message:`Update: ${title}`,tree:tree.sha,parents:[headSha]})});await gh('/git/refs/heads/main',{method:'PATCH',body:JSON.stringify({sha:newCommit.sha,force:false})});
    return NextResponse.json({ok:true,commit:newCommit.sha,url:`https://blog.marzan.info/posts/${originalSlug}`});
  }catch(error){console.error(error);return NextResponse.json({error:error instanceof Error?error.message:'Update failed.'},{status:500})}
}

export async function DELETE(request:Request){
  if(!await requireAdmin()) return NextResponse.json({error:'Unauthorized'},{status:401});
  try{
    const input=await request.json();const slug=String(input.slug??'');if(!validSlug(slug)) return NextResponse.json({error:'Invalid slug.'},{status:400});
    const head=await gh('/git/ref/heads/main');const headSha=head.object.sha as string;const commit=await gh(`/git/commits/${headSha}`);const fullTree=await gh(`/git/trees/${commit.tree.sha}?recursive=1`);
    const postPath=`content/posts/${slug}.mdx`,imagePrefix=`public/images/posts/${slug}/`;
    const files=(fullTree.tree as TreeItem[]).filter(x=>x.type==='blob'&&(x.path===postPath||x.path.startsWith(imagePrefix)));
    if(!files.some(x=>x.path===postPath)) return NextResponse.json({error:'Post not found.'},{status:404});
    const deletions=files.map(x=>({path:x.path,mode:'100644',type:'blob',sha:null}));
    const tree=await gh('/git/trees',{method:'POST',body:JSON.stringify({base_tree:commit.tree.sha,tree:deletions})});const newCommit=await gh('/git/commits',{method:'POST',body:JSON.stringify({message:`Delete post: ${slug}`,tree:tree.sha,parents:[headSha]})});await gh('/git/refs/heads/main',{method:'PATCH',body:JSON.stringify({sha:newCommit.sha,force:false})});
    return NextResponse.json({ok:true,commit:newCommit.sha});
  }catch(error){console.error(error);return NextResponse.json({error:error instanceof Error?error.message:'Delete failed.'},{status:500})}
}
