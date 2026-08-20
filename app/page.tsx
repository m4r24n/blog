import Link from 'next/link';
const posts=[
 {date:'20 AUG 2026',title:'A place for unfinished thoughts',excerpt:'Why I wanted a small corner of the internet where projects, photographs and ordinary days can coexist.',tag:'Journal',slug:'unfinished-thoughts'},
 {date:'18 AUG 2026',title:'What I am building right now',excerpt:'A running note about current experiments, software projects, and the things I am trying to understand.',tag:'Projects',slug:'building-right-now'},
 {date:'12 AUG 2026',title:'Notes from somewhere else',excerpt:'A few photographs, a train ride, and the details that would otherwise disappear from memory.',tag:'Places',slug:'notes-from-somewhere-else'}
];
export default function Home(){return <><section className="hero"><div className="kicker">PERSONAL JOURNAL · PROJECT LOG · PHOTOGRAPHS</div><h1>Things I noticed,<br/>made &amp; remembered.</h1><p>No strict theme. Just notes from life, work in progress, places I go, photographs I keep, and ideas that deserve more than a browser tab.</p></section><section><div className="section-head"><h2>Latest entries</h2><span className="meta">2026</span></div>{posts.map(p=><article className="post" key={p.slug}><div className="meta">{p.date}</div><div><Link href={`/posts/${p.slug}`}><h2>{p.title}</h2></Link><p>{p.excerpt}</p><span className="tag">{p.tag}</span></div></article>)}</section></>}
