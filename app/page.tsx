import Link from 'next/link';

const posts = [
  {
    date: '20 AUG 2026',
    title: 'A place for unfinished thoughts',
    excerpt: 'Why I wanted a small corner of the internet where projects, photographs and ordinary days can coexist.',
    tag: 'Journal',
    slug: 'unfinished-thoughts',
    visual: 'one'
  },
  {
    date: '18 AUG 2026',
    title: 'What I am building right now',
    excerpt: 'A running note about current experiments, software projects, and the things I am trying to understand.',
    tag: 'Projects',
    slug: 'building-right-now',
    visual: 'two'
  },
  {
    date: '12 AUG 2026',
    title: 'Notes from somewhere else',
    excerpt: 'A few photographs, a train ride, and the details that would otherwise disappear from memory.',
    tag: 'Places',
    slug: 'notes-from-somewhere-else',
    visual: 'three'
  }
];

export default function Home() {
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
      <div className="section-head"><h2>Latest entries</h2><span className="meta">2026 · 03 notes</span></div>
      {posts.map(p => <article className="post" key={p.slug}>
        <div className="meta">{p.date}</div>
        <div className="post-copy">
          <Link href={`/posts/${p.slug}`}><h2>{p.title}</h2></Link>
          <p>{p.excerpt}</p>
          <span className="tag">{p.tag}</span>
        </div>
        <Link href={`/posts/${p.slug}`} aria-label={`Open ${p.title}`}><div className={`post-visual ${p.visual}`} /></Link>
      </article>)}
    </section>
  </>;
}
