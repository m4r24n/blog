import Link from 'next/link';
import { getAllPosts } from '../../lib/posts';

const descriptions: Record<string, string> = {
  Journal: 'Personal notes, observations and whatever feels worth writing down.',
  Projects: 'Things I am building, testing, fixing or learning through making.',
  Photography: 'Photographs and the stories or details around them.',
  Places: 'Travel notes, walks, trains and places I want to remember.',
  Learning: 'Ideas, books, technical notes and things I recently understood.',
  Work: 'Selected professional notes and updates from ongoing work.',
};

export default function Categories() {
  const posts = getAllPosts();
  const categories = Object.keys(descriptions).map((name) => ({ name, count: posts.filter((post) => post.category === name).length }));

  return <>
    <div className="kicker">Browse</div>
    <h1 className="page-title">Categories</h1>
    <p className="page-intro">Loose shelves, not strict boxes. A post can belong wherever it makes the most sense.</p>
    <div className="cards">{categories.map(({ name, count }) => <Link className="card" href={`/categories/${name.toLowerCase()}`} key={name}><h2>{name}</h2><p>{descriptions[name]}</p><span className="meta">{count} {count === 1 ? 'entry' : 'entries'}</span></Link>)}</div>
  </>;
}
