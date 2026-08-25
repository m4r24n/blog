import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getAllPosts } from '../../../lib/posts';
import { categories, categoryMeta } from '../../../lib/category-art';

export function generateStaticParams(){return Object.values(categories).map(x=>({category:x.slug}))}
export default async function CategoryPage({params}:{params:Promise<{category:string}>}){const {category}=await params;const pair=Object.entries(categories).find(([,m])=>m.slug===category.toLowerCase());if(!pair)notFound();const [label,meta]=pair;const posts=getAllPosts().filter(p=>p.category===label);return <><Link className="back-link" href="/categories">← Categories</Link><header className="category-hero"><img src={meta.art} alt=""/><div><div className="kicker">Browse</div><h1 className="page-title">{label}</h1><p className="page-intro">{meta.description}</p></div></header>{posts.length===0?<p className="page-intro">Nothing filed here yet.</p>:<section className="category-post-grid">{posts.map(post=>{const art=categoryMeta(post.category).art;return <Link href={`/posts/${post.slug}`} key={post.slug} className="category-post">{post.image?<img src={post.image} alt={post.imageAlt||post.title}/>:<img src={art} alt=""/>}<span>{post.title}</span></Link>})}</section>}</>}
