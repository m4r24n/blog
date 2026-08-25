import Link from 'next/link';
import { getAllPosts } from '../../lib/posts';
import { categories } from '../../lib/category-art';

export default function Categories(){const posts=getAllPosts();return <><div className="kicker">Browse</div><h1 className="page-title">Categories</h1><p className="page-intro">Loose shelves, not strict boxes. Each one has its own small visual marker.</p><div className="category-cards">{Object.entries(categories).map(([name,meta])=>{const count=posts.filter(p=>p.category===name).length;return <Link href={`/categories/${meta.slug}`} className="category-card" key={name}><img src={meta.art} alt=""/><div><h2>{name}</h2><p>{meta.description}</p><span className="meta">{count} {count===1?'entry':'entries'}</span></div></Link>})}</div></>}
