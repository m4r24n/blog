import Link from 'next/link';
import { getAllPosts } from '../lib/posts';
import styles from './GalleryHome.module.css';

export default function Home() {
  const posts = getAllPosts();

  return <div className={styles.home}>
    <header className={styles.intro}>
      <div>
        <div className="kicker">Journal · Projects · Photographs</div>
        <h1>Notes, work and places — mostly through pictures.</h1>
      </div>
      <p>Each image is an entry. Click a photograph to open the full article.</p>
    </header>

    <section className={styles.grid} aria-label="Journal entries">
      {posts.map((post, index) => (
        <article className={styles.item} key={post.slug}>
          <Link className={styles.link} href={`/posts/${post.slug}`} aria-label={`Open ${post.title}`}>
            <div className={`${styles.frame} ${styles[`shape${(index % 5) + 1}`]}`}>
              {post.image ? (
                <img className={styles.image} src={post.image} alt={post.imageAlt || post.title} />
              ) : (
                <div className={styles.fallback}><span>{post.category}</span></div>
              )}
              <div className={styles.overlay}>
                <span className={styles.category}>{post.category}</span>
                <h2>{post.title}</h2>
              </div>
            </div>
            <div className={styles.mobileCaption}>
              <span>{post.category}</span>
              <h2>{post.title}</h2>
            </div>
          </Link>
        </article>
      ))}
    </section>
  </div>;
}
