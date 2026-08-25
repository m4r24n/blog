import Link from 'next/link';
import { getAllPosts } from '../lib/posts';

export default function Home() {
  const posts = getAllPosts();

  return <section className="portfolio-grid" aria-label="Journal entries">
    {posts.map((post) => (
      <article className="portfolio-item" key={post.slug}>
        <Link href={`/posts/${post.slug}`} aria-label={`Open ${post.title}`}>
          {post.image ? (
            <img src={post.image} alt={post.imageAlt || post.title} />
          ) : (
            <div className="portfolio-placeholder"><span>{post.title}</span></div>
          )}
        </Link>
      </article>
    ))}
  </section>;
}
