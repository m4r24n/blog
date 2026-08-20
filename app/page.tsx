import Link from 'next/link';
import { formatPostDate, getAllPosts } from '../lib/posts';

export default function Home() {
  const posts = getAllPosts();

  return <>
    <section className="hero">
      <div className="hero-copy">
        <div className="kicker">Personal journal · Project log · Photographs</div>
        <h1>Things I noticed, made &amp; remembered.</h1>
        <p>No strict theme. Just notes from life, work in progress, places I go, photographs I keep, and ideas that deserve more than a browser tab.</p>
      </div>
      <aside className="hero-note">
        <strong>Currently</strong>
        Building this place slowly, keeping notes from current projects, and trying to publish before everything feels finished.
      </aside>
    </section>

    <section>
      <div className="section-head"><h2>Latest entries</h2><span className="meta">{posts.length.toString().padStart(2, '0')} notes</span></div>
      {posts.map((post, index) => <article className="post" key={post.slug}>
        <div className="meta">{formatPostDate(post.date)}<br />{post.readingTime}</div>
        <div className="post-copy">
          <Link href={`/posts/${post.slug}`}><h2>{post.title}</h2></Link>
          <p>{post.excerpt}</p>
          <span className="tag">{post.category}</span>
        </div>
        <Link href={`/posts/${post.slug}`} aria-label={`Open ${post.title}`}>
          {post.image ? <img className="post-image" src={post.image} alt={post.imageAlt || ''} /> : <div className={`post-visual ${['one','two','three'][index % 3]}`} />}
        </Link>
      </article>)}
    </section>
  </>;
}
