import Link from 'next/link';
import { getAllPosts } from '../lib/posts';
import { categories, categoryMeta } from '../lib/category-art';

export default function Home() {
  const posts = getAllPosts();
  return <>
    <nav className="category-strip" aria-label="Browse categories">{Object.entries(categories).map(([name,meta])=><Link href={`/categories/${meta.slug}`} key={name}><img src={meta.art} alt=""/><span>{name}</span></Link>)}</nav>
    <section className="portfolio-grid" aria-label="Journal entries">
      {posts.map((post) => { const cat=categoryMeta(post.category); return <article className="portfolio-item" key={post.slug}><Link href={`/posts/${post.slug}`} aria-label={`Open ${post.title}`}>{post.image?<img src={post.image} alt={post.imageAlt || post.title}/>:<div className="portfolio-placeholder illustrated"><img src={cat.art} alt=""/><span>{post.title}</span></div>}</Link><div className="portfolio-meta"><img src={cat.art} alt=""/><span>{post.category}</span></div></article>})}
    </section>
  </>;
}
