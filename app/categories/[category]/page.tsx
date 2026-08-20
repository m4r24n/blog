import Link from 'next/link';
import { notFound } from 'next/navigation';
import { formatPostDate, getAllPosts } from '../../../lib/posts';

const labels: Record<string, string> = {
  journal: 'Journal',
  projects: 'Projects',
  photography: 'Photography',
  places: 'Places',
  learning: 'Learning',
  work: 'Work',
};

export function generateStaticParams() {
  return Object.keys(labels).map((category) => ({ category }));
}

export default async function CategoryPage({ params }: { params: Promise<{ category: string }> }) {
  const { category } = await params;
  const label = labels[category.toLowerCase()];
  if (!label) notFound();
  const posts = getAllPosts().filter((post) => post.category.toLowerCase() === label.toLowerCase());

  return <>
    <Link className="back-link" href="/categories">← Categories</Link>
    <div className="kicker">Browse</div>
    <h1 className="page-title">{label}</h1>
    {posts.length === 0 ? <p className="page-intro">Nothing filed here yet. This shelf is ready when a post belongs on it.</p> : <section>{posts.map((post) => <article className="post" key={post.slug}><div className="meta">{formatPostDate(post.date)}<br />{post.readingTime}</div><div className="post-copy"><Link href={`/posts/${post.slug}`}><h2>{post.title}</h2></Link><p>{post.excerpt}</p></div><div /></article>)}</section>}
  </>;
}
